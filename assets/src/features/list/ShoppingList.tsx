import React from "react";
import ShoppingListItem from "./ShoppingListItem";
import makeStyles from "@material-ui/core/styles/makeStyles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import Input from "@material-ui/core/Input";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch } from "react-redux";
import { useTypedSelector } from "../../reducers";
import { addItem, toggleItem, removeItem } from "./listSlice";

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

const ShoppingList = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const items = useTypedSelector((store) => store.items);
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
              dispatch(addItem(e.currentTarget.value));
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
            onClick={(checked) => dispatch(toggleItem(item.id, checked))}
            onRemove={() => dispatch(removeItem(item.id))}
          />
        );
      })}
    </List>
  );
};

export default ShoppingList;
