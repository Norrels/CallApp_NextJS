import { Box, styled, Text } from "@ignite-ui/react";

export const ProfileBox = styled(Box, {
    marginTop: '$6',
    flexDirection: 'column',
    display: 'flex',
    gap: '$2',

    label: {
        display: 'flex',
        flexDirection: 'column',
        gap: '$2',
    }
})

export const FormAnnotation = styled(Text, {
    color: '$gray200'
})