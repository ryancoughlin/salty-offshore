const AppBar = () => {
  return (
    <div className="w-12 h-full py-4 bg-neutral-950 flex justify-center">
      <a 
        href="/"
        className="w-8 h-8"
        aria-label="Return to SaltyOffshore Ocean Data home"
        tabIndex={0}
      >
        <img 
          src="/Salty-Logo.svg" 
          alt=""
          className="w-full h-full"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}

export default AppBar; 