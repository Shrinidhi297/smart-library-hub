import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
        </div>
    );
};

export default SignUpPage;
