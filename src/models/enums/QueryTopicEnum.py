from enum import Enum

# the topics a student query can be classified into
class QueryTopicEnum(Enum):
    REGULATIONS = "regulations"
    CURRICULUM = "curriculum"
    COURSES = "courses"
    DEPARTMENTS = "departments"
    ACADEMIC_CALENDAR = "academic_calendar"
    SOCIAL = "social"
    NON_RELEVANT = "non-relevant"
    OTHER = "other"

    # topic values, used for classification prompts and schemes
    @classmethod
    def values(cls):
        return [member.value for member in cls]
