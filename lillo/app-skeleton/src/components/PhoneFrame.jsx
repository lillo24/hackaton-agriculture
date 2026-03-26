import './PhoneFrame.css';

function PhoneFrame({ children }) {
  return (
    <div className="phone-body">
      <div className="phone-bezel">
        <div className="phone-screen">
          <div className="phone-content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default PhoneFrame;
