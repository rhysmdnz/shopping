defmodule ShoppingElixir.Repo do
  use Ecto.Repo,
    otp_app: :shopping_elixir,
    adapter: Ecto.Adapters.Postgres
end
