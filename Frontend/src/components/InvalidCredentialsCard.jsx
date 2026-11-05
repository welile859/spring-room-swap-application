

import "./InvalidCredentialsCard.css";

function InvalidCredentialsCard({ message }) {
    return (
        <div className="invalid-credentials-card" role="alert">
            <div className="invalid-credentials-icon">
                !
            </div>

            <div className="invalid-credentials-content">
                <h3>Login unsuccessful</h3>
                <p>{message}</p>
            </div>
        </div>
    );
}

export default InvalidCredentialsCard;
