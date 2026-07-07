from .BaseService import BaseService
from typing import Any, Optional, List, Dict
from datetime import datetime
import time

HYDE_INPUT_PRICE_PER_1M = 0.25
HYDE_OUTPUT_PRICE_PER_1M = 1.5

EMBEDDING_INPUT_PRICE_PER_1M = 0.13
EMBEDDING_OUTPUT_PRICE_PER_1M = 0.0  # Embeddings only use input tokens

CLASSIFICATION_INPUT_PRICE_PER_1M = 0.029
CLASSIFICATION_OUTPUT_PRICE_PER_1M = 0.14


def calculate_cost(input_tokens: int, output_tokens: int, input_price_per_1m: float, output_price_per_1m: float) -> float:
    """Calculate cost given token counts and price per 1,000,000 tokens."""
    in_cost = ((input_tokens or 0) / 1000000.0) * input_price_per_1m
    out_cost = ((output_tokens or 0) / 1000000.0) * output_price_per_1m
    return round(in_cost + out_cost, 9)


class MonitorService(BaseService):
    
    def __init__(self, chat_history: Optional[dict] = None):
        super().__init__()
        self.chat_history = chat_history or {}
        self.recorded_tools_usage: List[Dict[str, Any]] = []

    def record_search_tool_usage(
        self,
        hyde_prompt_tokens: int = 0,
        hyde_completion_tokens: int = 0,
        embedding_tokens: int = 0,
        query_embed_tokens: int = 0,
        hyde_embed_tokens: int = 0,
        query: str = "",
        retrieved_documents: Optional[list] = None
    ):
        """Record metrics when the search tool is invoked during an agent run."""
        self.recorded_tools_usage.append({
            "hyde_prompt_tokens": hyde_prompt_tokens or 0,
            "hyde_completion_tokens": hyde_completion_tokens or 0,
            "embedding_tokens": embedding_tokens or 0,
            "query_embed_tokens": query_embed_tokens or 0,
            "hyde_embed_tokens": hyde_embed_tokens or 0,
            "query": query,
            "retrieved_documents": retrieved_documents or [],
            "timestamp": time.time()
        })

    def construct_trace(
        self,
        query_text: str,
        result: Any,
        latency_seconds: float = 0.0,
        total_cost: float = 0.0
    ) -> List[Dict[str, Any]]:
        """Construct the step-by-step trace of the agent execution."""
        trace: List[Dict[str, Any]] = [
            {
                "step_type": "USER_PROMPT",
                "title": "USER PROMPT",
                "content": query_text
            }
        ]
        
        if not result:
            return trace
            
        messages = []
        if hasattr(result, "new_messages"):
            new_msgs_attr = getattr(result, "new_messages", None)
            messages = new_msgs_attr() if callable(new_msgs_attr) else (new_msgs_attr or [])
        if not messages and hasattr(result, "all_messages"):
            all_msgs_attr = getattr(result, "all_messages", None)
            messages = all_msgs_attr() if callable(all_msgs_attr) else (all_msgs_attr or [])
            
        tool_call_idx = 0
        for msg in messages:
            parts = getattr(msg, "parts", [])
            for part in parts:
                part_type = part.__class__.__name__
                if part_type == "TextPart":
                    content = getattr(part, "content", "")
                    # If this is not the final answer output, label as THINK
                    if content and content != getattr(result, "output", ""):
                        trace.append({
                            "step_type": "THINK",
                            "title": "THINK",
                            "content": content
                        })
                    elif content:
                        trace.append({
                            "step_type": "FINAL_RESPONSE",
                            "title": "FINAL RESPONSE TO USER",
                            "content": content
                        })
                elif part_type == "ToolCallPart":
                    tool_name = getattr(part, "tool_name", "unknown_tool")
                    args = getattr(part, "args", {})
                    trace.append({
                        "step_type": "TOOL_CALL",
                        "title": f"TOOL CALL: {tool_name}",
                        "content": f"{tool_name}({args})",
                        "tool_name": tool_name,
                        "args": args
                    })
                elif part_type == "ToolReturnPart":
                    tool_name = getattr(part, "tool_name", "unknown_tool")
                    content = getattr(part, "content", "")
                    trace.append({
                        "step_type": "TOOL_RESULT",
                        "title": f"TOOL RESULT: {tool_name}",
                        "content": str(content),
                        "tool_name": tool_name
                    })
                    tool_call_idx += 1
                    
        # Ensure final response is present in trace if not already added
        final_output = getattr(result, "output", None)
        if final_output and not any(step.get("step_type") == "FINAL_RESPONSE" for step in trace):
            trace.append({
                "step_type": "FINAL_RESPONSE",
                "title": "FINAL RESPONSE TO USER",
                "content": str(final_output)
            })
            
        return trace

    def get_query_monitor_data(
        self,
        result: Any,
        query_text: str,
        latency_seconds: float = 0.0,
        agent_model: Optional[str] = None,
        embedding_model: Optional[str] = None,
        hyde_model: Optional[str] = None,
        classification_model: Optional[str] = None,
        classification_prompt_tokens: int = 0,
        classification_completion_tokens: int = 0
    ) -> Dict[str, Any]:
        """Aggregate all monitoring metrics, costs, token usage, and trace for a query run."""
        usage = None
        if result and hasattr(result, "usage"):
            usage_attr = getattr(result, "usage", None)
            usage = usage_attr() if callable(usage_attr) else usage_attr
        
        agent_cost = 0.0
        if result:
            messages = getattr(result, "new_messages", None)
            messages = messages() if callable(messages) else (messages or [])
            if not messages:
                messages = getattr(result, "all_messages", None)
                messages = messages() if callable(messages) else (messages or [])
            
            for msg in messages:
                pd = getattr(msg, "provider_details", None) if not isinstance(msg, dict) else msg.get("provider_details")
                if pd:
                    agent_cost += getattr(pd, "cost", 0.0) if not isinstance(pd, dict) else pd.get("cost", 0.0) or 0.0

        if agent_cost == 0 and self.chat_history:
            turns = self._extract_per_turn_metrics_from_history(self.chat_history if isinstance(self.chat_history, list) else [self.chat_history])
            if turns:
                agent_cost = turns[-1].get("provider_cost", 0.0)

        total_query_embed = sum(call.get("query_embed_tokens", 0) for call in self.recorded_tools_usage)
        total_hyde_embed = sum(call.get("hyde_embed_tokens", 0) for call in self.recorded_tools_usage)
        total_hyde_prompt = sum(call.get("hyde_prompt_tokens", 0) for call in self.recorded_tools_usage)
        total_hyde_completion = sum(call.get("hyde_completion_tokens", 0) for call in self.recorded_tools_usage)
        tool_calls_count = len(self.recorded_tools_usage)

        embedding_cost = calculate_cost(total_query_embed + total_hyde_embed, 0, EMBEDDING_INPUT_PRICE_PER_1M, EMBEDDING_OUTPUT_PRICE_PER_1M)
        hyde_cost = calculate_cost(total_hyde_prompt, total_hyde_completion, HYDE_INPUT_PRICE_PER_1M, HYDE_OUTPUT_PRICE_PER_1M)
        classification_cost = calculate_cost(classification_prompt_tokens, classification_completion_tokens, CLASSIFICATION_INPUT_PRICE_PER_1M, CLASSIFICATION_OUTPUT_PRICE_PER_1M)
        tools_cost = round(embedding_cost + hyde_cost, 9)
        total_cost = round(agent_cost + embedding_cost + hyde_cost + classification_cost, 9)
        
        agent_input_tokens = getattr(usage, "request_tokens", None) or getattr(usage, "input_tokens", 0) or 0 if usage else 0
        agent_output_tokens = getattr(usage, "response_tokens", None) or getattr(usage, "output_tokens", 0) or 0 if usage else 0
        
        tokens_in = agent_input_tokens + total_hyde_prompt + total_query_embed + total_hyde_embed + classification_prompt_tokens
        tokens_out = agent_output_tokens + total_hyde_completion + classification_completion_tokens
        
        trace = self.construct_trace(
            query_text=query_text,
            result=result,
            latency_seconds=latency_seconds,
            total_cost=total_cost
        )
        
        return {
            "agent_in_tokens": agent_input_tokens,
            "agent_out_tokens": agent_output_tokens,
            "query_embed_tokens": total_query_embed,
            "hyde_embed_tokens": total_hyde_embed,
            "hyde_prompt_tokens": total_hyde_prompt,
            "hyde_completion_tokens": total_hyde_completion,
            "query_classification_prompt_tokens": classification_prompt_tokens,
            "query_classification_completion_tokens": classification_completion_tokens,
            "agent_cost": round(agent_cost, 9),
            "tools_cost": tools_cost,
            "embedding_cost": embedding_cost,
            "hyde_cost": hyde_cost,
            "classification_cost": classification_cost,
            "total_cost": total_cost,
            "tokens_in": tokens_in,
            "tokens_out": tokens_out,
            "tool_calls_count": tool_calls_count,
            "latency_seconds": round(latency_seconds, 4),
            "trace": trace
        }

    @staticmethod
    def calculate_project_stats(queries: List[Any]) -> Dict[str, Any]:
        """Calculate average and total costs across all queries in a project."""
        if not queries:
            return {
                "total_queries_count": 0,
                "avg_query_cost": 0.0,
                "avg_agent_cost": 0.0,
                "avg_tools_cost": 0.0,
                "total_project_cost": 0.0,
                "total_agent_cost": 0.0,
                "total_tools_cost": 0.0,
                "total_embedding_cost": 0.0,
                "total_hyde_cost": 0.0,
                "avg_latency_seconds": 0.0
            }
            
        count = len(queries)
        total_cost = sum(getattr(q, "total_cost", 0.0) or 0.0 for q in queries)
        total_agent = sum(getattr(q, "agent_cost", 0.0) or 0.0 for q in queries)
        total_tools = sum(getattr(q, "tools_cost", 0.0) or 0.0 for q in queries)
        total_embed = sum(getattr(q, "embedding_cost", 0.0) or 0.0 for q in queries)
        total_hyde = sum(getattr(q, "hyde_cost", 0.0) or 0.0 for q in queries)
        total_class = sum(getattr(q, "classification_cost", 0.0) or 0.0 for q in queries)
        total_latency = sum(getattr(q, "latency_seconds", 0.0) or 0.0 for q in queries)
        
        return {
            "total_queries_count": count,
            "avg_query_cost": round(total_cost / count, 6),
            "avg_agent_cost": round(total_agent / count, 6),
            "avg_tools_cost": round(total_tools / count, 6),
            "total_project_cost": round(total_cost, 6),
            "total_agent_cost": round(total_agent, 6),
            "total_tools_cost": round(total_tools, 6),
            "total_embedding_cost": round(total_embed, 6),
            "total_hyde_cost": round(total_hyde, 6),
            "total_classification_cost": round(total_class, 6),
            "avg_latency_seconds": round(total_latency / count, 4)
        }

    @staticmethod
    def _extract_per_turn_metrics_from_history(chat_history: List[Dict]) -> List[Dict[str, Any]]:
        """Extract per-turn cost/token/latency from the pydantic-ai chat_history messages."""
        if not chat_history:
            return []
        
        runs = {}
        run_order = []
        for msg in chat_history:
            run_id = msg.get("run_id") or msg.get("conversation_id", "unknown")
            if run_id not in runs:
                runs[run_id] = []
                run_order.append(run_id)
            runs[run_id].append(msg)
        
        turn_metrics = []
        for run_id in run_order:
            messages = runs[run_id]
            total_in = 0
            total_out = 0
            total_cost = 0.0
            first_ts = None
            last_ts = None
            
            for msg in messages:
                ts = msg.get("timestamp")
                if ts:
                    if first_ts is None:
                        first_ts = ts
                    last_ts = ts
                
                if msg.get("kind") == "response":
                    usage = msg.get("usage", {})
                    if usage:
                        total_in += usage.get("input_tokens", 0) or 0
                        total_out += usage.get("output_tokens", 0) or 0
                    pd = msg.get("provider_details", {})
                    if pd:
                        total_cost += pd.get("cost", 0.0) or 0.0
            
            latency = 0.0
            if first_ts and last_ts and first_ts != last_ts:
                try:
                    from datetime import datetime as dt
                    t0 = dt.fromisoformat(first_ts.replace("Z", "+00:00"))
                    t1 = dt.fromisoformat(last_ts.replace("Z", "+00:00"))
                    latency = round((t1 - t0).total_seconds(), 4)
                except Exception:
                    latency = 0.0
            
            turn_metrics.append({
                "tokens_in": total_in,
                "tokens_out": total_out,
                "provider_cost": round(total_cost, 6),
                "latency": latency,
            })
        
        return turn_metrics

    @staticmethod
    def calculate_conversation_stats(chat: Any, queries: List[Any], chat_history: Optional[List[Dict]] = None) -> Dict[str, Any]:
        """Calculate statistics and format query traces for a specific conversation."""
        turn_metrics = MonitorService._extract_per_turn_metrics_from_history(chat_history or [])
        
        formatted_queries = []
        for idx, q in enumerate(queries):
            hm = turn_metrics[idx] if idx < len(turn_metrics) else None
            q_agent = hm["provider_cost"] if hm else (getattr(q, "agent_cost", 0.0) or 0.0)
            q_tin = getattr(q, "tokens_in", 0) or (hm["tokens_in"] if hm else 0)
            q_tout = getattr(q, "tokens_out", 0) or (hm["tokens_out"] if hm else 0)
            q_latency = getattr(q, "latency_seconds", 0.0) or (hm["latency"] if hm else 0.0)
            
            q_embed_tok = getattr(q, "query_embed_tokens", 0) or 0
            h_embed_tok = getattr(q, "hyde_embed_tokens", 0) or 0
            h_prompt_tok = getattr(q, "hyde_prompt_tokens", 0) or 0
            h_comp_tok = getattr(q, "hyde_completion_tokens", 0) or 0
            c_prompt_tok = getattr(q, "query_classification_prompt_tokens", 0) or 0
            c_comp_tok = getattr(q, "query_classification_completion_tokens", 0) or 0
            
            q_embed = calculate_cost(q_embed_tok + h_embed_tok, 0, EMBEDDING_INPUT_PRICE_PER_1M, EMBEDDING_OUTPUT_PRICE_PER_1M)
            q_hyde = calculate_cost(h_prompt_tok, h_comp_tok, HYDE_INPUT_PRICE_PER_1M, HYDE_OUTPUT_PRICE_PER_1M)
            q_tools = round(q_embed + q_hyde, 9)
            q_class = calculate_cost(c_prompt_tok, c_comp_tok, CLASSIFICATION_INPUT_PRICE_PER_1M, CLASSIFICATION_OUTPUT_PRICE_PER_1M)
            q_cost = round(q_agent + q_embed + q_hyde + q_class, 9)
            
            formatted_queries.append({
                "query_id": str(getattr(q, "id", "")),
                "query_text": getattr(q, "query_text", ""),
                "query_answer": getattr(q, "query_answer", ""),
                "query_topic": getattr(q, "query_topic", ""),
                "createdAt": getattr(q, "createdAt", None).isoformat() if getattr(q, "createdAt", None) else None,
                "agent_cost": q_agent,
                "tools_cost": q_tools,
                "embedding_cost": q_embed,
                "hyde_cost": q_hyde,
                "classification_cost": q_class,
                "total_cost": q_cost,
                "tokens_in": q_tin,
                "tokens_out": q_tout,
                "agent_in_tokens": getattr(q, "agent_in_tokens", 0) or q_tin,
                "agent_out_tokens": getattr(q, "agent_out_tokens", 0) or q_tout,
                "query_embed_tokens": q_embed_tok,
                "hyde_embed_tokens": h_embed_tok,
                "hyde_prompt_tokens": h_prompt_tok,
                "hyde_completion_tokens": h_comp_tok,
                "query_classification_prompt_tokens": c_prompt_tok,
                "query_classification_completion_tokens": c_comp_tok,
                "tool_calls_count": getattr(q, "tool_calls_count", 0) or 0,
                "latency_seconds": q_latency,
                "trace": getattr(q, "trace", []) or []
            })
            
        count = len(formatted_queries) or len(turn_metrics)
        total_cost = sum(fq["total_cost"] for fq in formatted_queries) if formatted_queries else sum(m["provider_cost"] for m in turn_metrics)
        total_agent = sum(fq["agent_cost"] for fq in formatted_queries) if formatted_queries else sum(m["provider_cost"] for m in turn_metrics)
        total_tools = sum(fq["tools_cost"] for fq in formatted_queries) if formatted_queries else 0.0
        total_latency = sum(fq["latency_seconds"] for fq in formatted_queries) if formatted_queries else sum(m["latency"] for m in turn_metrics)
        total_tokens_in = sum(fq["tokens_in"] for fq in formatted_queries) if formatted_queries else sum(m["tokens_in"] for m in turn_metrics)
        total_tokens_out = sum(fq["tokens_out"] for fq in formatted_queries) if formatted_queries else sum(m["tokens_out"] for m in turn_metrics)
            
        return {
            "chat_id": str(getattr(chat, "id", "")),
            "chat_title": getattr(chat, "chat_title", ""),
            "is_guest_chat": getattr(chat, "is_guest_chat", False),
            "updatedAt": getattr(chat, "updatedAt", None).isoformat() if getattr(chat, "updatedAt", None) else None,
            "queries_count": count,
            "total_conversation_cost": round(total_cost, 6),
            "total_agent_cost": round(total_agent, 6),
            "total_tools_cost": round(total_tools, 6),
            "avg_query_cost_in_conversation": round(total_cost / count, 6) if count > 0 else 0.0,
            "avg_latency_seconds": round(total_latency / count, 4) if count > 0 else 0.0,
            "total_tokens_in": total_tokens_in,
            "total_tokens_out": total_tokens_out,
            "queries": formatted_queries
        }

