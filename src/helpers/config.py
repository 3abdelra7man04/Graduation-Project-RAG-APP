from pydantic_settings import BaseSettings, SettingsConfigDict

# Settings class that's used in main get the app configurations
class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    OPENAI_API_KEY: str

    FILE_ALLOWED_TYPES: list
    FILE_MAX_SIZE: int
    FILE_DEFAULT_CHUNK_SIZE: int

    MONGODB_URL: str
    MONGODB_DATABASE: str

    class Config():
        env_file = ".env"       # .env path described for the BaseSettings class

def get_settings():
    return Settings()
