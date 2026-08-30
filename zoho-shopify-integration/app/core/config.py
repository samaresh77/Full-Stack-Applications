from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_version: str
    debug: bool

    zoho_client_id: str = ""
    zoho_client_secret: str = ""
    zoho_redirect_uri: str = ""

    shopify_shop_domain: str = ""
    shopify_access_token: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()