require IEx
import Ecto.Query, only: [from: 2]

defmodule ShoppingElixirWeb.ListChannel do
  use Phoenix.Channel

  alias ShoppingElixir.Item
  alias ShoppingElixir.Repo

  def join("shoppinglist", _message, socket) do
    {:ok, socket}
  end

  def handle_in("items/addItem", %{"payload" => payload, "type" => type}, socket) do
    changeset = Item.changeset(%Item{}, payload)

    case Repo.insert(changeset) do
      {:ok, _item} ->
        broadcast_from!(socket, "action", %{payload: payload, type: type})

      _ ->
        nil
    end

    {:reply, :ok, socket}
  end

  def handle_in("items/toggleItem", %{"payload" => payload, "type" => type}, socket) do
    {:ok, time, _} = DateTime.from_iso8601(payload["updated"])

    item = Repo.one(from i in Item, where: i.id == ^payload["id"] and i.updated < ^time)

    case item do
      nil ->
        nil

      item ->
        changeset =
          Item.changeset(item, %{"checked" => payload["checked"], "updated" => payload["updated"]})

        case Repo.update(changeset) do
          {:ok, _item} ->
            broadcast_from!(socket, "action", %{payload: payload, type: type})

          _ ->
            nil
        end
    end

    {:reply, :ok, socket}
  end

  def handle_in("items/editItem", %{"payload" => payload, "type" => type}, socket) do
    item = Repo.get(Item, payload["id"])

    case item do
      nil ->
        nil

      item ->
        changeset =
          Item.changeset(item, %{"value" => payload["value"], "updated" => payload["updated"]})

        case Repo.update(changeset) do
          {:ok, _item} ->
            broadcast_from!(socket, "action", %{payload: payload, type: type})

          _ ->
            nil
        end
    end

    {:reply, :ok, socket}
  end

  def handle_in("items/removeItem", %{"payload" => payload, "type" => type}, socket) do
    item = Repo.get(Item, payload["id"])

    case item do
      nil ->
        nil

      item ->
        Repo.delete!(item)
        broadcast_from!(socket, "action", %{payload: payload, type: type})
    end

    {:reply, :ok, socket}
  end

  def handle_in("items/fullList", _, socket) do
    items = ShoppingElixir.Repo.all(from i in Item, order_by: i.created)

    resp = %{
      "list" => Enum.map(items, fn i -> i.id end),
      "items" =>
        Enum.reduce(items, %{}, fn i, d ->
          Map.put(d, i.id, %{
            "id" => i.id,
            "value" => i.value,
            "checked" => i.checked,
            "created" => DateTime.to_iso8601(i.created),
            "updated" => DateTime.to_iso8601(i.updated)
          })
        end)
    }

    {:reply, {:ok, resp}, socket}
  end
end
