const Header = () => {
    return (
        <div style={{
            background: '#232870',
            color: '#F8FAFC',
            height: '60px',
            display: 'flex',
            top:'0%',
            right:'0%',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            width: '100%',
        }}>
            <img 
                src="/assets/logo.png"  // Ensure logo is in the public folder
                alt="Shri Vishnu Engineering College for Women logo"
                style={{
                    height: "75px",
                    width: "auto",
                    marginRight: "15px",
                }} 
            />
            <h2 style={{
                margin: 0,
                textAlign: "center",
                flexGrow: 1,
                color: "#F8FAFC",
                fontSize: "1.8rem",  // Adjust font size for better scaling
            }}>
                SHRI VISHNU ENGINEERING COLLEGE FOR WOMEN
            </h2>
        </div>
    );
};

export default Header;
