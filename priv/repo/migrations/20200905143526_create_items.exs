defmodule ShoppingElixir.Repo.Migrations.CreateItems do
  use Ecto.Migration

  def change do
    create table(:items, primary_key: false) do
      add :id, :binary, primary_key: true
      add :value, :string, null: false
      add :checked, :boolean, default: false, null: false
      add :created, :utc_datetime_usec, null: false

      timestamps()
    end
  end
end
