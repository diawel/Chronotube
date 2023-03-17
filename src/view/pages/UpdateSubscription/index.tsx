import Ad from 'src/view/components/atoms/Ad'
import PrimaryButton from 'src/view/components/molecules/PrimaryButton'
import ColumnContent from 'src/view/components/templates/ColumnContent'
import styled from 'styled-components'
import InitPage from '../util/InitPage'
import Abstract from './Abstract'
import Description from './Description'

const UpdateSubscription: React.FC = () => {
  return (
    <ColumnContent>
      <InitPage />
      <Abstract />
      <a href="/api/redirect.php">
        <PrimaryButton text="登録チャンネルを更新" />
      </a>
      {Description}
      <AdWrapper>
        <Ad />
      </AdWrapper>
    </ColumnContent>
  )
}

const AdWrapper = styled.div`
  margin-top: 80px;
`

export default UpdateSubscription
