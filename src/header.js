const Header = () => {
    return (
        <div style={{
            background: '#232870',
        color: '#F8FAFC',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed', 
        top: '0',
        width: '100%',
        zIndex: 10, 
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}>
            <img 
                src="./assets/logo.png" 
                alt="Logo" 
                style={{
                    height: "50px",
                    width: "auto",
                    marginRight: "15px",
                }} 
            />
            <h2 style={{
                margin: 0,
                textAlign: "center",
                flexGrow: 1,
                color: "#F8FAFC",
            }}>
                SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN
            </h2>
        </div>
    );
};
export default Header;