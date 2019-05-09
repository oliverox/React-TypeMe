import TypeMe from './TypeMe';
import Text from './Text';

const Delete = () => null;
Delete.defaultProps = {
  characters: 0
};

const LineBreak = () => null;

const Delay = () => null;
Delay.defaultProps = {
  ms: 0
};

export { Delete, Delay, LineBreak, Text };
export default TypeMe;