defmodule ShoppingElixir.Item do
  use Ecto.Schema
  import Ecto.Changeset
  @primary_key {:id, :binary_id, autogenerate: false}

  schema "items" do
    field :checked, :boolean, default: false
    field :created, :utc_datetime_usec, null: false
    field :updated, :utc_datetime_usec, null: false
    field :value, :string, null: false
  end

  @doc false
  def changeset(item, attrs) do
    item
    |> cast(attrs, [:id, :value, :checked, :created, :updated])
    |> validate_required([:id, :value, :checked, :created, :updated])
    |> unique_constraint(:name, name: :items_pkey)
  end
end
