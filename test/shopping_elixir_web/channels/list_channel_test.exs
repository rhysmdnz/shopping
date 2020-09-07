defmodule ShoppingElixirWeb.ListChannelTest do
  use ShoppingElixirWeb.ChannelCase, async: true

  alias ShoppingElixir.Item
  alias ShoppingElixir.Repo

  @item %{
    "id" => "700b31cc-5b8d-4079-a745-7a1f72d7b097",
    "created" => "2020-09-07T10:24:37.404Z",
    "updated" => "2020-09-07T10:24:37.404Z",
    "value" => "Milk"
  }

  def item_fixture(attrs \\ %{}) do
    item_data = attrs |> Enum.into(@item)
    Item.changeset(%Item{}, item_data) |> Repo.insert!()
  end

  setup do
    {:ok, _, socket} =
      ShoppingElixirWeb.UserSocket
      |> socket("user_id", %{some: :assign})
      |> subscribe_and_join(ShoppingElixirWeb.ListChannel, "shoppinglist")

    %{socket: socket}
  end

  test "adding item", %{socket: socket} do
    ref =
      push(socket, "items/addItem", %{
        "type" => "items/addItem",
        "payload" => @item
      })

    assert_reply ref, :ok

    assert ShoppingElixir.Repo.get(ShoppingElixir.Item, "700b31cc-5b8d-4079-a745-7a1f72d7b097")

    assert_broadcast "action", %{
      payload: @item,
      type: "items/addItem"
    }
  end

  test "adding item already exists", %{socket: socket} do
    item_fixture()

    ref =
      push(socket, "items/addItem", %{
        "type" => "items/addItem",
        "payload" => @item
      })

    assert_reply ref, :ok
  end

  @toggle_item %{
    "id" => "700b31cc-5b8d-4079-a745-7a1f72d7b097",
    "checked" => true,
    "updated" => "2020-09-07T10:24:39.404Z"
  }

  test "toggle item", %{socket: socket} do
    item_fixture()

    ref =
      push(socket, "items/toggleItem", %{
        "type" => "items/toggleItem",
        "payload" => @toggle_item
      })

    assert_reply ref, :ok
    assert Repo.get(Item, "700b31cc-5b8d-4079-a745-7a1f72d7b097").checked

    assert_broadcast "action", %{
      payload: @toggle_item,
      type: "items/toggleItem"
    }
  end

  test "toggle item older updated date", %{socket: socket} do
    item_fixture()

    ref =
      push(socket, "items/toggleItem", %{
        "type" => "items/toggleItem",
        "payload" => Enum.into(%{"updated" => "2020-09-06T10:24:37.404Z"}, @toggle_item)
      })

    assert_reply ref, :ok
    assert Repo.get(Item, "700b31cc-5b8d-4079-a745-7a1f72d7b097").checked === false
  end

  test "toggle missing item", %{socket: socket} do
    ref =
      push(socket, "items/toggleItem", %{
        "type" => "items/toggleItem",
        "payload" => @toggle_item
      })

    assert_reply ref, :ok
  end

  @edit_item %{
    "id" => "700b31cc-5b8d-4079-a745-7a1f72d7b097",
    "updated" => "2020-09-07T10:24:39.404Z",
    "value" => "Cheese"
  }

  test "edit item", %{socket: socket} do
    item_fixture()

    ref =
      push(socket, "items/editItem", %{
        "type" => "items/editItem",
        "payload" => @edit_item
      })

    assert_reply ref, :ok
    assert Repo.get(Item, "700b31cc-5b8d-4079-a745-7a1f72d7b097").value === "Cheese"

    assert_broadcast "action", %{
      payload: @edit_item,
      type: "items/editItem"
    }
  end

  test "edit missing item", %{socket: socket} do
    ref =
      push(socket, "items/editItem", %{
        "type" => "items/editItem",
        "payload" => @edit_item
      })

    assert_reply ref, :ok
  end

  @remove_item %{
    "id" => "700b31cc-5b8d-4079-a745-7a1f72d7b097",
    "updated" => "2020-09-07T10:24:39.404Z"
  }

  test "remove item", %{socket: socket} do
    item_fixture()

    ref =
      push(socket, "items/removeItem", %{
        "type" => "items/removeItem",
        "payload" => @remove_item
      })

    assert_reply ref, :ok
    assert Repo.get(Item, "700b31cc-5b8d-4079-a745-7a1f72d7b097") === nil

    assert_broadcast "action", %{
      payload: @remove_item,
      type: "items/removeItem"
    }
  end

  test "remove missing item", %{socket: socket} do
    ref =
      push(socket, "items/removeItem", %{
        "type" => "items/removeItem",
        "payload" => @remove_item
      })

    assert_reply ref, :ok
  end
end
