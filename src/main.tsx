type MainProps = {
    children: React.ReactNode;
};

function Main({ children }: MainProps) {
    return (
        <div className="main">
            <main>{children}</main>
        </div>
    );
}

export default Main;
