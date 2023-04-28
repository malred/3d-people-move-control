import { useEffect, useState } from "react"

export const useInput = () => {
    const [input, setInput] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        shift: false,
        jump: false
    })
    const keys = {
        KeyW: 'forward',
        KeyS: 'backward',
        KeyA: 'left',
        KeyD: 'right',
        ShiftLeft: 'shift',
        Space: 'jump'
    }
    // @ts-ignore
    const findKey = (key: string) => keys[key]
    useEffect(() => {
        // @ts-ignore
        const handleKeyDown = (e) => {
            // 根据e.code找到input里对应的值->true
            setInput((m) => ({ ...m, [findKey(e.code)]: true }))
        }
        // @ts-ignore
        const handleKeyUp = (e) => {
            setInput((m) => ({ ...m, [findKey(e.code)]: false }))
        }
        // 按下按键会触发
        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('keyup', handleKeyUp)
        // 回调
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('keyup', handleKeyUp)
        }
    }, [])
    return input
}