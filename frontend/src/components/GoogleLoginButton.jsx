import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/authService";

const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID"; // .env-ში შეინახე

export default function GoogleLoginButton({ onSuccess, onError }) {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          try {
            const data = await googleLogin(credentialResponse.credential);
            onSuccess(data.user);
          } catch (err) {
            onError(err.message);
          }
        }}
        onError={() => onError("Google login failed")}
        useOneTap
        shape="pill"
        theme="filled_blue"
        text="continue_with"
        locale="ka"
      />
    </GoogleOAuthProvider>
  );
}

