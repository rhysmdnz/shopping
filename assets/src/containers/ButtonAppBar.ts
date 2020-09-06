import { connect, ConnectedProps } from 'react-redux';
import ButtonAppBar from '../components/ButtonAppBar';
import { RootState } from '../reducers'

const mapStateToProps = (state: RootState) => {
  return {
    connected: state.socketio.connected
  };
};

const connector = connect(mapStateToProps)
export type Props = ConnectedProps<typeof connector>

const ButtonAppBarContainer = connector(ButtonAppBar);

export default ButtonAppBarContainer;
