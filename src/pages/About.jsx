
import styled from "styled-components";

const StyledParagraph = styled.p`
  font-family: "Courier New", Courier, monospace;
  text-align: center;
  overflow-wrap: break-word;
  width: 650px;
  line-height: 20px;
`;

function About() {
  return (
    <StyledParagraph>
      App where you can add tasks that you need to complete. You can check off
      your todos, edit, and sort alphabetically or by the time added in
      ascending or descending order. <br /> <br />
      Created by Stephanie Cueto
    </StyledParagraph>
  );
};

export default About;
