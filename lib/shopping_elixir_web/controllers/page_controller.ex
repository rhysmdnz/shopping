defmodule ShoppingElixirWeb.PageController do
  use ShoppingElixirWeb, :controller

  def index(conn, _params) do
    conn
    |> put_resp_header("content-type", "text/html; charset=utf-8")
    |> Plug.Conn.send_file(
      200,
      Path.join(Application.app_dir(:shopping_elixir), "priv/static/index.html")
    )
  end
end
