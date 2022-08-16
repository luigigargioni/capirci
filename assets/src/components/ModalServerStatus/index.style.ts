import styled from 'styled-components'

export const StyledImg = styled.img`
  display: block;
  margin-left: auto;
  margin-right: auto;
  height: 100%;
  width: auto;
`

export const WrapperLoader = styled.div`
  height: 100%;
  top: 50vh;
  left: 50vw;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const NoConnectionAnimation = styled.div`
  width: 162px;
  height: 90px;
  color: ${({ theme }) => theme.colors.primary.light1};
  --c: radial-gradient(farthest-side, currentColor 96%, #0000);
  background: var(--c) 100% 100% /30% 60%, var(--c) 70% 0 /50% 100%,
    var(--c) 0 100% /36% 68%, var(--c) 27% 18% /26% 40%,
    linear-gradient(currentColor 0 0) bottom/67% 58%;
  background-repeat: no-repeat;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: inherit;
    opacity: 0.4;
    animation: cloudAnimation 1.5s infinite;
  }
  @keyframes cloudAnimation {
    to {
      transform: scale(1.8);
      opacity: 0;
    }
  }
`

export const NoConnectionAnimation2 = styled.div`
  width: 65px;
  height: 117px;
  position: absolute;

  &:before,
  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.colors.contextual.warning.main};
    box-shadow: 0 0 0 50px;
    clip-path: polygon(
      100% 0,
      23% 46%,
      46% 44%,
      15% 69%,
      38% 67%,
      0 100%,
      76% 57%,
      53% 58%,
      88% 33%,
      60% 37%
    );
  }

  &:after {
    animation: thunderAnimation 1.5s infinite;
    transform: perspective(300px) translateZ(0px);
  }

  @keyframes thunderAnimation {
    to {
      transform: perspective(300px) translateZ(180px);
      opacity: 0;
    }
  }
`
