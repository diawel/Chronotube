import TextBlock from 'src/view/components/atoms/TextBlock'
import { color } from 'src/common/styles/color'
import styled from 'styled-components'

export type TitledValuePropsType = {
  title: string
  value: string
}

const titleStyle = { color: color.black, size: '12px' }
const valueStyle = { color: color.black, size: '36px', weight: 'bold' }

const TitledValue: React.FC<TitledValuePropsType> = (props) => {
  const { title, value } = props
  return (
    <Wrapper>
      <TextBlock style={titleStyle}>{title}</TextBlock>
      <TextBlock style={valueStyle}>{value}</TextBlock>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin-bottom: 4px;
`

export default TitledValue
