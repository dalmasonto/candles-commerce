import { Button } from '@mantine/core'
import React from 'react'

interface ISmallBtnBadge {
    label: string
    color: string
    width?: string
    variant?: string
}
const SmallBtnBadge = (props: ISmallBtnBadge) => {
    const {color, label, width, variant} = props

  return (
    <Button color={color} size='xs' variant={variant ?? 'light'} radius={'xl'}style={{width: width ?? '80px'}}>{label}</Button>
  )
}

export default SmallBtnBadge