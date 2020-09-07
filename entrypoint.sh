#!/bin/bash
# Docker entrypoint script.

# migrate database.
bin/shopping_elixir eval "ShoppingElixir.Release.migrate"

exec bin/shopping_elixir start