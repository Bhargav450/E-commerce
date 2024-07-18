import React, { useRef} from "react";
import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";
import "./SideDrawer.css";

const SideDrawer = (props) => {
  const nodeRef = useRef(null);

  const defaultStyle = {
    transition: `transform 200ms ease-out`,
    transform: 'translateX(-100%)',
  };

  const transitionStyles = {
    entering: { transform: 'translateX(0)' },
    entered: { transform: 'translateX(0)' },
    exiting: { transform: 'translateX(-100%)' },
    exited: { transform: 'translateX(-100%)' },
  };

  return ReactDOM.createPortal(
    <Transition
      nodeRef={nodeRef}
      in={props.show}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      {(state) => (
        <aside
          ref={nodeRef}
          className="side-drawer"
          style={{
            ...defaultStyle,
            ...transitionStyles[state],
          }}
          onClick={props.onClick}
        >
          {props.children}
        </aside>
      )}
    </Transition>,
    document.getElementById("drawer-hook")
  );
};

export default SideDrawer;
