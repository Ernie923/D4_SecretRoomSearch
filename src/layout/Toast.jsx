import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeMessage } from "../redux/slices/toastSlice";;
import { Toast as BsToast } from "bootstrap";

const TOAST_DURATION = 3000;

function Toast() {
    const messages = useSelector((state) => state.toast.messages);
    const toastRefs = useRef({});
    const dispatch = useDispatch();

    useEffect(() => {
        messages.forEach((message) => {
            const toastElement = toastRefs.current[message.id];
            if (toastElement) {
                const toastInstance = new BsToast(toastElement);
                toastInstance.show();
                setTimeout(() => {
                    dispatch(removeMessage(message.id));
                }, TOAST_DURATION);
            }
        });
    }, [messages]);

    const handleDismiss = (message_id) => {
        dispatch(removeMessage(message_id));
    }

    return (
        <div className="position-fixed top-0 end-0 p-3" style={{ zIndex: 4000 }}>
            {
                messages.map((message) => (
                    <div ref={(el) => toastRefs.current[message.id] = el} key={message.id} className="toast" role="alert" aria-live="assertive" aria-atomic="true">
                        <div className={`toast-header ${message.status === 'success' ? 'bg-success' : 'bg-danger'}  text-white`}>
                            <strong className="me-auto">{message.status === 'success' ? '成功' : '失敗'}</strong>
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => handleDismiss(message.id)}
                            ></button>
                        </div>
                        <div className="toast-body bg-white">
                            {message.text.includes("註冊成功") ?
                                (<pre>
                                    {message.text}
                                </pre>) :
                                (
                                    <pre className="fs-h6">
                                        {message.text}
                                    </pre>
                                )
                            }

                        </div>
                    </div>
                ))
            }
        </div >

    )
};

export default Toast;