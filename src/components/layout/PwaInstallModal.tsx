'use client'

import { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Download } from 'lucide-react'
import { usePWAStore } from '@/store/usePwaStore'

interface PWAInstallModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function PWAInstallModal({ open, onOpenChange }: PWAInstallModalProps) {
    const [dontShowAgain, setDontShowAgain] = useState(false)
    const { deferredPrompt, isInstallable, resetPrompt } = usePWAStore()

    const handleInstall = async () => {
        if (!deferredPrompt) return

        try {
            await deferredPrompt.prompt()
            const { outcome } = await deferredPrompt.userChoice

            if (outcome === 'accepted') {
                resetPrompt()
                onOpenChange(false)
            }
        } catch (error) {
            console.error('PWA 설치 중 오류 발생:', error)
        }
    }

    const handleClose = () => {
        if (dontShowAgain) {
            localStorage.setItem('pwa-install-modal-hidden', 'true')
        }
        onOpenChange(false)
    }

    return (
        <Dialog open={open && isInstallable} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>앱 설치하기</DialogTitle>
                    <DialogDescription>
                        더 나은 사용자 경험을 위해 길따라 앱을 설치해보세요!
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2 py-4">
                    <Checkbox
                        id="dont-show"
                        checked={dontShowAgain}
                        onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
                    />
                    <Label htmlFor="dont-show">다시 보지 않기</Label>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>
                        다음에 하기
                    </Button>
                    <Button onClick={handleInstall} className="gap-2">
                        <Download className="h-4 w-4" />
                        지금 설치하기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}