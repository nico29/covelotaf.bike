import { NextPage } from "next";
import { withApollo } from "../apollo/client";
import { useRouter } from "next/router";
import NavigationBar from "../components/navbar";
import PasswordResetRequestForm from "../components/PasswordResetRequestForm";
import PasswordResetConfirmForm from "../components/PasswordResetConfirmForm";

const ResetPasswordPage: NextPage = () => {
  const router = useRouter();
  const resetToken = router.query.resetToken as string;
  return (
    <main>
      <NavigationBar />
      {!resetToken && <PasswordResetRequestForm />}
      {resetToken && <PasswordResetConfirmForm resetToken={resetToken} />}
    </main>
  );
};

export default withApollo(ResetPasswordPage);
