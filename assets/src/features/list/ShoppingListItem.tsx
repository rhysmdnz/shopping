import React from "react";
import Checkbox from "@material-ui/core/Checkbox";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Box from "@material-ui/core/Box/Box";

interface ShoppingListItemProps {
  value: string;
  checked: boolean;
  onClick: {
    (checked: boolean): void;
  };
  onRemove: {
    (): void;
  };
}
const useStyles = makeStyles((theme) => ({
  checked: {
    textDecoration: "line-through",
  },
}));

const ShoppingListItem = ({
  value,
  checked,
  onClick,
  onRemove,
}: ShoppingListItemProps) => {
  const classes = useStyles();
  return (
    <ListItem
      role={undefined}
      button
      onClick={(event) => {
        onClick(!checked);
      }}
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          tabIndex={-1}
          checked={checked}
          onChange={(_, checked) => {
            onClick(checked);
          }}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Box
            className={checked ? classes.checked : ""}
            color={checked ? "text.disabled" : "text.primary"}
          >
            {value}
          </Box>
        }
        color={"disabled"}
      ></ListItemText>
      <ListItemSecondaryAction>
        <ListItemIcon>
          <IconButton aria-label="delete" onClick={onRemove}>
            <Delete />
          </IconButton>
        </ListItemIcon>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ShoppingListItem;
