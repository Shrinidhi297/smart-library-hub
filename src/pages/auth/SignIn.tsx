import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
        </div>
    );
};

export default SignInPage;
