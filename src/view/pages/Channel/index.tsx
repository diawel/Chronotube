import { useLiveQuery } from 'dexie-react-hooks'
import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { color } from 'src/common/styles/color'
import { subscription } from 'src/common/utils/db/subscription'
import { watchHistory } from 'src/common/utils/db/watchHistory'
import { VideoType } from 'src/common/utils/types/youtube'
import { DeviceContext } from 'src/index'
import Ad from 'src/view/components/atoms/Ad'
import EngageAddHistory from 'src/view/components/organisms/EngageAddHistory'
import styled, { keyframes } from 'styled-components'
import InitPage from '../util/InitPage'
import ChannelHystory from './ChannelHistory'
import IconBox from './IconBox'
import KeyVideos from './KeyVideos'
import SkeletonIconBox from './SkeletonIconBox'
import SkeletonKeyVideos from './SkeletonKeyVideos'

const Channel: React.FC = () => {
  const deviceType = useContext(DeviceContext)
  const navigate = useNavigate()
  const { id } = useParams()
  if (!id) return <></>

  const ad = (
    <AdWrapper>
      <Ad />
    </AdWrapper>
  )

  const liveQuery = useLiveQuery(async () => {
    const channel = await subscription.channels.get(id)
    const firstPlayback = await watchHistory.histories
      .where({ 'uploader.id': id })
      .first()
    const channelHistories = await watchHistory.histories
      .where({ 'uploader.id': id })
      .toArray()
    const channelVideos: {
      [key: string]: VideoType & { playCount: number }
    } = {}
    channelHistories.forEach((history) => {
      if (!channelVideos[history.id])
        channelVideos[history.id] = { ...history, playCount: 0 }
      channelVideos[history.id].playCount++
    })

    return {
      historyCount: await watchHistory.histories.count(), // 再生履歴の有効性確認用
      channel: channel,
      firstPlayback: firstPlayback,
      mostPlayedVideo: Object.values(channelVideos).length
        ? Object.values(channelVideos).reduce((a, b) =>
            a.playCount > b.playCount ? a : b
          )
        : undefined,
      triggerPlayback: firstPlayback
        ? await watchHistory.histories
            .where('playbackDate')
            .below(firstPlayback.playbackDate)
            .last()
        : undefined,
      channelHistories: channelHistories,
    }
  })

  let node, channelName

  if (liveQuery) {
    if (!liveQuery.channel) {
      navigate('/', { replace: true })
      return <></>
    }

    const {
      historyCount,
      channel,
      firstPlayback,
      mostPlayedVideo,
      triggerPlayback,
      channelHistories,
    } = liveQuery

    channelName = channel.name

    let videoColumnInner = (
      <>
        <KeyVideos
          firstPlayback={firstPlayback}
          mostPlayedVideo={mostPlayedVideo}
          triggerPlayback={triggerPlayback}
        />
        {ad}
        <ChannelHystory
          histories={channelHistories}
          subscribeDate={channel.subscribeDate}
        />
      </>
    )

    if (!historyCount)
      videoColumnInner = (
        <>
          <EngageAddHistory />
          <BlurBox>{videoColumnInner}</BlurBox>
        </>
      )

    switch (deviceType) {
      case 'mobile':
        node = (
          <MobileContainer>
            <IconWrapper>
              <IconBox channel={channel} withPlayCount={historyCount > 0} />
            </IconWrapper>
            <VideoColumn padding="0" margin="0 auto">
              {videoColumnInner}
            </VideoColumn>
          </MobileContainer>
        )
        break
      case 'pc':
        node = (
          <PcContainer>
            <IconColumn>
              <IconBox channel={channel} withPlayCount={historyCount > 0} />
            </IconColumn>
            <VideoColumn padding="108px 24px" margin="0">
              {videoColumnInner}
            </VideoColumn>
          </PcContainer>
        )
        break
    }
  } else {
    switch (deviceType) {
      case 'mobile':
        node = (
          <MobileContainer>
            <IconWrapper>
              <SkeletonIconBox />
            </IconWrapper>
            <VideoColumn padding="0" margin="0 auto">
              <SkeletonKeyVideos />
            </VideoColumn>
          </MobileContainer>
        )
        break
      case 'pc':
        node = (
          <PcContainer>
            <IconColumn>
              <SkeletonIconBox />
            </IconColumn>
            <VideoColumn padding="108px 24px" margin="0">
              <SkeletonKeyVideos />
            </VideoColumn>
          </PcContainer>
        )
        break
    }
  }

  return (
    <Wrapper>
      <InitPage
        themeColor={color.white}
        pageTitle={channelName ? `${channelName} | Chronotube` : 'Chronotube'}
      />
      {node}
    </Wrapper>
  )
}

const show = keyframes`
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`

const Wrapper = styled.div`
  animation: ${show} 0.3s ease-out both;
`

const PcContainer = styled.div`
  background: ${color.white};
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: space-evenly;
  margin-top: -8px;
  padding-top: 8px;
`

const IconColumn = styled.div`
  width: 280px;
  height: 100svh;
  padding: 24px;
  box-sizing: border-box;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  position: sticky;
  top: 0;
`

type VideoColumnWrapperStyleType = {
  padding: string
  margin: string
}

const VideoColumn = styled.div<VideoColumnWrapperStyleType>(
  (style) => `
    padding: ${style.padding};
    margin: ${style.margin};
    width: 100%;
    max-width: 440px;
  `
)

const MobileContainer = styled.div`
  background: ${color.white};
  min-height: 100vh;
  padding: calc(64px + 8px) 16px 64px;
  margin-top: -8px;
`

const IconWrapper = styled.div`
  width: 100%;
  max-width: 240px;
  margin: 0 auto 64px;
  display: flex;
  justify-content: center;
`

const BlurBox = styled.div`
  filter: blur(2px);
`

const AdWrapper = styled.div`
  margin: 64px 0;
`

export default Channel
