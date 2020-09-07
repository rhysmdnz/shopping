defmodule ShoppingElixir.Repo.Migrations.AddUpdated do
  use Ecto.Migration

  def change do
    alter table(:items, primary_key: false) do
      remove :inserted_at
      remove :updated_at
      add :updated, :utc_datetime_usec, null: false, default: fragment("NOW()")
    end

    alter table(:items, primary_key: false) do
      modify :updated, :utc_datetime_usec, null: false
    end
  end
end
