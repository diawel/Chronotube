import { useContext } from 'react'
import { DeviceContext } from 'src/index'
import styled from 'styled-components'
import TextBlock from 'src/view/components/atoms/TextBlock'
import Logo from 'src/view/components/atoms/Logo'
import { color } from 'src/common/styles/color'
import { fontSize } from 'src/common/styles/fontSize'
import { ml } from 'src/common/utils/switchLanguages'

const LogoBox: React.FC = () => {
  const DeviceType = useContext(DeviceContext)
  return (
    <Wrapper>
      <Logo width={DeviceType === 'mobile' ? '220px' : '280px'} />
      <TextBlock color={color.black} size={fontSize.regular}>
        {ml({
          ja: 'YouTubeのチャンネル登録日を検索',
          en: 'Find the date you subscribed to YouTube channels.',
        })}
      </TextBlock>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  text-align: center;
  margin: 60px 0 120px;
`

export default LogoBox
