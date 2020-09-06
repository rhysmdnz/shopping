require IEx
import Ecto.Query, only: [from: 2]

defmodule ShoppingElixirWeb.ListChannel do
  use Phoenix.Channel

  def join("shoppinglist", _message, socket) do
    {:ok, socket}
  end

  def handle_in("items/addItem", %{"payload" => payload, "type" => type}, socket) do
    changeset = ShoppingElixir.Item.changeset(%ShoppingElixir.Item{}, payload)

    if changeset.valid? do
      ShoppingElixir.Repo.insert!(changeset)
      broadcast_from!(socket, "items/addItem", %{payload: payload, type: type})
    end

    {:noreply, socket}
  end

  def handle_in("items/toggleItem", %{"payload" => payload, "type" => type}, socket) do
    item = ShoppingElixir.Repo.get!(ShoppingElixir.Item, payload["id"])
    changeset = ShoppingElixir.Item.changeset(item, %{"checked" => payload["checked"]})

    if changeset.valid? do
      ShoppingElixir.Repo.update!(changeset)
      broadcast_from!(socket, "items/toggleItem", %{payload: payload, type: type})
    end

    {:noreply, socket}
  end

  def handle_in("items/editItem", %{"payload" => payload, "type" => type}, socket) do
    broadcast_from!(socket, "items/editItem", %{payload: payload, type: type})
    {:noreply, socket}
  end

  def handle_in("items/fullList", _, socket) do
    items = ShoppingElixir.Repo.all(from i in ShoppingElixir.Item, order_by: i.created)

    resp = %{
      "list" => Enum.map(items, fn i -> i.id end),
      "items" =>
        Enum.reduce(items, %{}, fn i, d ->
          Map.put(d, i.id, %{
            "id" => i.id,
            "value" => i.value,
            "checked" => i.checked,
            "created" => DateTime.to_iso8601(i.created)
          })
        end),
      "updated" => DateTime.to_iso8601(DateTime.now!("Etc/UTC"))
    }

    # IEx.pry()
    # broadcast_from!(socket, "items/editItem", %{payload: payload, type: type})
    {:reply, {:ok, resp}, socket}
  end
end
