import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

interface ShoppingListItemProps {
  value?: string;
  checked?: boolean;
  onClick?: {
    (event: React.ChangeEvent<HTMLInputElement>, checked: boolean): void;
  };
  onEdit: { (event: React.ChangeEvent<HTMLInputElement>): void };
}

const ShoppingListItem = ({
  value,
  checked,
  onClick,
  onEdit,
}: ShoppingListItemProps) => (
  <ListItem role={undefined} button>
    <ListItemIcon>
      <Checkbox
        edge="start"
        tabIndex={-1}
        checked={checked}
        onChange={onClick}
      />
    </ListItemIcon>
    <ListItemText primary={value}></ListItemText>
    {/* <div>
      <Input
        placeholder="Add Item"
        disableUnderline={true}
        value={value}
        onChange={onEdit}
      />
    </div>
    <Divider /> */}
  </ListItem>
);

export default ShoppingListItem;
