import React from "react";
import ShoppingListItem from "./ShoppingListItem";
import { makeStyles } from "@material-ui/core/styles";
import { Props } from "../containers/ShoppingListContainer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Input from "@material-ui/core/Input";
import AddIcon from "@material-ui/icons/Add";

const useStyles = makeStyles((theme) => ({
  list: {
    listStyleType: "none",
    padding: 0,
  },
  root: {
    width: "100%",
    backgroundColor: theme.palette.background.paper,
  },
}));

const ShoppingList = ({ items, onItemClick, onItemEdit, onItemAdd }: Props) => {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      <ListItem role={undefined}>
        <ListItemIcon>
          <AddIcon />
        </ListItemIcon>
        <Input
          placeholder="Add Item"
          disableUnderline={true}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Enter") {
              onItemAdd(e.currentTarget.value);
              e.currentTarget.value = "";
            }
          }}
        />
      </ListItem>
      {items.list.map((id) => {
        const item = items.items[id];
        return (
          <ShoppingListItem
            key={item.id}
            checked={item.checked}
            value={item.value}
            onClick={(event, checked) => onItemClick(item.id, checked)}
            onEdit={(event) => onItemEdit(item.id, event.target.value)}
          />
        );
      })}
      {/* <ShoppingListItem onEdit={event => onItemAdd(event.target.value)} /> */}
    </List>
  );
};

export default ShoppingList;
