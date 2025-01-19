from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    website_url: str
    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()