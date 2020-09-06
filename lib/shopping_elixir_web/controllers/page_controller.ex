defmodule ShoppingElixirWeb.PageController do
  use ShoppingElixirWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
