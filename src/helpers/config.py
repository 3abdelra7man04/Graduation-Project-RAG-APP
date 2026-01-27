from pydantic_settings import BaseSettings, SettingsConfigDict

# Settings class that's used in main get the app configurations
class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    OPENAI_API_KEY: str

    class Config():
        env_file = ".env"       # .env path described for the BaseSettings class

def get_settings():
    return Settings()
