const Message = ({ variant = 'info', children }) => (
  <div className={`message message-${variant}`}>{children}</div>
);

export default Message;
