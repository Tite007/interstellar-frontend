import React from 'react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@heroui/modal'
import { Button } from '@heroui/button'
import { useDisclosure } from '@heroui/modal'
import {
  FacebookShareButton,
  FacebookMessengerShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailShareButton,
  TelegramIcon,
  TelegramShareButton,
  FacebookIcon,
  FacebookMessengerIcon,
  XIcon,
  WhatsappIcon,
  EmailIcon,
} from 'react-share'
import { Share } from 'lucide-react'

const ShareModal = ({ productName, shareUrl }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const shareTitle = productName || 'Check out this product'

  return (
    <>
      <Button
        endContent={<Share size={16} strokeWidth={1.5} />}
        size="sm"
        variant="flat"
        color="primary"
        onPress={onOpen}
        className="mb-2 mt-3"
      >
        Share
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Share {productName}
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-wrap gap-4 justify-center">
                  <FacebookMessengerShareButton
                    url={shareUrl}
                    hashtag="#CoffeeLovers"
                    className="flex flex-col items-center"
                  >
                    <FacebookMessengerIcon size={32} round />
                  </FacebookMessengerShareButton>
                  <FacebookShareButton
                    url={shareUrl}
                    hashtag="#CoffeeLovers"
                    className="flex flex-col items-center"
                  >
                    <FacebookIcon size={32} round />
                    <span className="mt-1 text-sm"></span>
                  </FacebookShareButton>
                  <TwitterShareButton
                    url={shareUrl}
                    title={shareTitle}
                    hashtags={['Coffee', 'Product']}
                    className="flex flex-col items-center"
                  >
                    <XIcon size={32} round />
                  </TwitterShareButton>
                  <WhatsappShareButton
                    url={shareUrl}
                    title={shareTitle}
                    separator=":: "
                    className="flex flex-col items-center"
                  >
                    <WhatsappIcon size={32} round />
                  </WhatsappShareButton>
                  <TelegramShareButton
                    url={shareUrl}
                    title={shareTitle}
                    separator=":: "
                    className="flex flex-col items-center"
                  >
                    <TelegramIcon size={32} round />
                  </TelegramShareButton>
                  <EmailShareButton
                    url={shareUrl}
                    subject={shareTitle}
                    body="Check out this product: "
                    className="flex flex-col items-center"
                  >
                    <EmailIcon size={32} round />
                  </EmailShareButton>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="solid" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}

export default ShareModal
