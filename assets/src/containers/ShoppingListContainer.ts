import { connect, ConnectedProps } from "react-redux";
import ShoppingList from "../components/ShoppingList";
import { addItem, editItem, toggleItem } from "../features/list/listSlice";
import { RootState } from "../reducers";
import { Dispatch } from "redux";

const mapStateToProps = (state: RootState) => {
  return {
    items: state.items,
  };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
  return {
    onItemClick: (id: string, checked: boolean) => {
      dispatch(toggleItem(id, checked));
    },
    onItemAdd: (value: string) => {
      dispatch(addItem(value));
    },
    onItemEdit: (id: string, value: string) => {
      dispatch(editItem(id, value));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);
export type Props = ConnectedProps<typeof connector>;

const ShoppingListContainer = connector(ShoppingList);

export default ShoppingListContainer;
