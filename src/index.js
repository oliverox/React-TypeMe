import TypeMe from './TypeMe';

const Delete = () => null;
Delete.displayName = 'Delete';
Delete.defaultProps = {
  characters: 0
};

const LineBreak = () => null;
LineBreak.displayName = 'LineBreak';

const Delay = () => null;
Delay.displayName = 'Delay';
Delay.defaultProps = {
  ms: 0
};

export { Delete, Delay, LineBreak };
export default TypeMe;
