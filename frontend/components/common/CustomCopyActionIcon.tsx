import { CopyButton, ActionIcon, em, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface ICustomCopyActionIcon {
    value: string
    color?: string
    size?: string
    copyText?: string
}

function CustomCopyActionIcon(props: ICustomCopyActionIcon) {
    const { value, color, size, copyText } = props
    return (
        <CopyButton value={value}>
            {({ copied, copy }) => (
                <Tooltip label={copied ? "Copied" : copyText ?? 'Copy'} radius={'md'} transitionProps={{transition: "fade-down"}}>
                    <ActionIcon color={copied ? 'teal' : color} onClick={copy} size={size} variant='transparent'>
                        {copied ? <IconCheck size={'18px'} stroke={em(1.5)} /> : <IconCopy size={'18px'} stroke={em(1.5)} />}
                    </ActionIcon>
                </Tooltip>
            )}
        </CopyButton>
    );
}

export default CustomCopyActionIcon