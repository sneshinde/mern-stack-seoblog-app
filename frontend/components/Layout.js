import Header from "./Header";

const Layout = ({children}) => {
    return (
        <React.Fragment>
            <Header></Header>
            {children}
            <p>
                footer
            </p>
        </React.Fragment>
    );
}

export default Layout;