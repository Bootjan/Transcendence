interface MessageProps {
      color: string;
      children: React.ReactNode;
    }

    function StyledMessage(props: MessageProps) {
       const contentStyle = {
         color: props.color,
         fontSize: "20px",
       };
       return (
         <>
          <p style={contentStyle}>{props.children}</p>
         </>
       );
     }
export default StyledMessage;
