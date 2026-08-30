from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str
    app_version: str
    debug: bool

    # Zoho
    zoho_client_id: str = ""
    zoho_client_secret: str = ""
    zoho_redirect_uri: str = ""

    # Shopify
    shopify_shop_domain: str = ""
    shopify_client_id: str = ""
    shopify_client_secret: str = ""
    shopify_access_token: str = ""
    shopify_api_version: str = "2026-07"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()