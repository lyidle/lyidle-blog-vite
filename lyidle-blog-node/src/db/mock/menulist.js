"use strict"

// 生成随机 `vh` 高度 1-100
const randomHeight = () => `${Math.floor(Math.random() * 100) + 1}vh`

module.exports = [
  {
    name: "Home",
    to: "/note",
    layout: { topnavWidth: "100px", topnavDirection: "right" },
    bannerImg: { height: "50vh" },
    // #region
    icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAAAXNSR0IArs4c6QAAIABJREFUeF7tnQe0r2V15p8AMRApgqAgolhAhNFRg8aoFBFbbAgRNdZkjWvQ6FJndDSxR82oo07GHhNHYZhYI7GMio2mKGoQBBQMKNJCAKlWVJj/xu9wD9xz7//r7977/X1rnXXF+5a9f8977n6+9n6/Iw4IQAACEIAABKoj8DvVZUzCEIAABCAAAQgIA8AigAAEIAABCFRIAANQoeikDAEIQAACEMAAsAYgAAEIQAACFRLAAFQoOilDAAIQgAAEMACsAQhAAAIQgECFBDAAFYpOyhCAAAQgAAEMAGsAAhCAAAQgUCEBDECFopMyBCAAAQhAAAPAGoAABCAAAQhUSAADUKHopAwBCEAAAhDAALAGIAABCEAAAhUSwABUKDopQwACEIAABDAArAEIQAACEIBAhQQwABWKTsoQgAAEIAABDABrAAIQgAAEIFAhAQxAhaKTMgQgAAEIQAADwBqAAAQgAAEIVEgAA1Ch6KQMAQhAAAIQwACwBiAAAQhAAAIVEsAAVCg6KUMAAhCAAAQwAKwBCEAAAhCAQIUEMAAVik7KEIAABCAAAQwAawACEIAABCBQIQEMQIWikzIEIAABCEAAA8AagAAEIAABCFRIAANQoeikDAEIQAACEMAAsAYgAAEIQAACFRLAAFQoOilDAAIQgAAEMACsAQhAAAIQgECFBDAAFYpOyhCAAAQgAAEMAGsAAhCAAAQgUCEBDECFopMyBCAAAQhAAAPAGoAABCAAAQhUSAADUKHopAwBCEAAAhDAALAGIAABCEAAAhUSwABUKDopQwACEIAABDAArAEIQAACEIBAhQQwABWKTsoQgAAEIAABDABrAAIQgAAEIFAhAQxAhaKTMgQgAAEIQAADwBqAAAQgAAEIVEgAA1Ch6KQMAQhAAAIQwACwBiAAAQhAAAIVEsAAVCg6KUMAAhCAAAQwAKwBCEAAAhCAQIUEMAAVik7KEIAABCAAAQwAawACEIDAOAQOkvQnkvaStH3zc72ky5qfMxZ/91FJnxxnOkaBwDACGIBh/OgNAQjUTWBbSa+U9CxJt2yJ4hpJ75X015KubtmHZhAYnQAGYHSkDAgBCFRC4PmLPF8t6VY9871c0iskvatnf7pBYBABDMAgfHSGAAQqJLC1pKMkHTBS7kdLOpSrASPRZJjWBDAArVHREAIQgIB2k/RZSXcZmcXZkh4h6ZyRx2U4CGyQAAaAxQEBCECgHYE9Fmf9x0vaoV3zzq0ulbSvpDM796QDBHoQwAD0gEYXCECgOgJTF/8VoJiA6pZWuYQxAOXYMzMEIBCDwFzFHxMQYz2kiRIDkEZKEoEABCYgMHfxxwRMICJDrk0AA8DKgAAEILA2gVLFHxPAipyFAAZgFsxMAgEIBCNQuvhjAoItmIjhYgAiqkbMEIDAlAS8FH9MwJQqM7YwACwCCEAAAusIeCv+mABW52QEMACToWVgCEAgGAGvxR8TEGwhRQkXAxBFKeKEAASmJOC9+GMCplS/0rExAJUKT9oQgMCNBKIUf0wAi3ZUAhiAUXEyGAQgEIxAtOKPCQi2wDyHiwHwrA6xQQACUxKIWvwxAVOuiorGxgBUJDapQgACYS/7b0g6vh3Aou5NAAPQGx0dIQCBoASin/nfHDsmIOhCLB02BqC0AswPAQjMSSBb8ed2wJyrJ9lcGIBkgpIOBCCwQQJZiz8mgEXfiwAGoBc2OkEAAsEIZC/+mIBgC9JDuBgADyoQAwQgMCWBWoo/JmDKVZRwbAxAQlFJCQIQuJFAbcUfE8Dib00AA9AaFQ0hAIFgBGot/piAYAu1VLgYgFLkmRcCEJiSQO3FHxMw5epKMjYGIImQpAEBCFR/2X9DS4B9AvjlWJMABoCFAQEIZCLAmf/aamICMq3ykXLBAIwEkmEgAIHiBCj+G5cAE1B8ifoKAAPgSw+igQAE+hGg+Lfjhglox6mKVhiAKmQmSQikJkDx7yYvJqAbr7StMQBppSUxCFRBgOLfT2ZMQD9uqXphAFLJSTIQqIoAxX+Y3JiAYfzC98YAhJeQBCBQJQGK/ziyYwLG4RhyFAxASNkIGgJVE6D4jys/JmBcnmFGwwCEkYpAIQABSRT/aZYBJmAarq5HxQC4lofgIACBVQQo/tMuB0zAtHzdjY4BcCcJAUEAAmsQsOJ/gqTtA9H5URPrHQPFfJmkfSSdGShmQu1JAAPQExzdIACB2QhEPPO/oCmkBsmMy+1nozV8Iq4EDGcYYgQMQAiZCBIC1RKIXPzPbVTbFRNQ7fp1nTgGwLU8BAeBqglkKP4rAmICql7KPpPHAPjUhaggUDuBTMUfE1D7anaaPwbAqTCEBYGKCWQs/piAihe019QxAF6VIS4I1Ekgc/HHBNS5pt1mjQFwKw2BQaA6AjUUf0xAdcvab8IYAL/aEBkEaiJQU/HHBNS0sh3nigFwLA6hQaASAjUWf0xAJYvbc5oYAM/qEBsE8hOoufhjAvKvb9cZYgBcy0NwEEhNgOK/Tl72CUi91H0mhwHwqQtRQSA7AYr/+gpjArKvemf5YQCcCUI4EKiAAMV/wyJjAir4BfCSIgbAixLEAYE6CFD8l+uMCVjOiBYjEMAAjACRISAAgVYEKP6tMN3QCBPQnhUtexLAAPQERzcIQKATAYp/J1yYgO646NGVAAagKzHaQwACXQlQ/LsSW9eeKwH92dFzCQEMAEsEAhCYkgDFfzhdTMBwhoywBgEMAMsCAhCYigDFfzyymIDxWDJSQwADwFKAAASmIEDxH58qJmB8plWPiAGoWn6Sh8AkBCj+k2C9YVBMwHRsqxsZA1Cd5CQMgUkJUPwnxYsJmB5vPTNgAOrRmkwhMDUBiv/UhNeNf1dJJ0jacb4pB890qaR9JZ05eCQGGIUABmAUjAwCgeoJUPznXwKYgPmZp5oRA5BKTpKBQBECFP8i2G+YFBNQjn34mTEA4SUkAQgUJUDxL4ofE1Aef9wIMABxtSNyCJQmQPEvrcC6+bkS4EeLMJFgAMJIRaAQcEWA4u9KDq4E+JPDf0QYAP8aESEEvBGg+HtThCsBfhVxHBkGwLE4hAYBhwTsUvOJknZwGNuGQrpA0j6Szg0U85BQuR0whF5FfTEAFYlNqhAYSCBiYamt+K9IHFEr9gkY+AvatTsGoCsx2kOgTgIRC0qtxR8TUOfvaOesMQCdkdEBAtURoPjHlTyidlwJmGm9YQBmAs00EAhKIGIBqf3M/+ZLLaKGmIAZ/sHAAMwAmSkgEJRAxMJB8V97sUXUEhMw8T8cGICJATM8BIISiFgwKP4bX2wRNcUETPgPCAZgQrgMDYGgBCIWCop/u8UWUVtMQDttO7fCAHRGRgcIpCYQsUBQ/LstyYgaYwK6adyqNQagFSYaQaAKAhELA8W/39KMqDUmoJ/WG+yFARgZKMNBICiBiAWB4j9ssUXUHBMwTPOb9MYAjAiToSAQlEDEQkDxH2exRdQeEzCO9sIAjASSYSAQlEDEAkDxH3exRVwDmIAR1gAGYASIDAGBoAQi/sNP8Z9msUVcC5iAgWsBAzAQIN0hEJRAxH/wKf7TLraIawITMGBNYAAGwKMrBIISiPgPPcV/nsUW8XPPmICeawMD0BMc3SAQlADFP6hwM4a9h6TjJe0w45xDp8IE9CCIAegBjS4QCEqA4h9UuAJhYwIKQJ97SgzA3MSZDwJlCFD8y3CPPCsmILJ6LWLHALSARBMIBCdA8Q8uYMHwMQEF4U89NQZgasKMD4GyBCj+ZflnmB0TkEHFNXLAACQVlrQgIInizzIYiwAmYCySjsbBADgSg1AgMCIBiv+IMBnqBgKYgGQLAQOQTFDSgQBn/qyBCQlgAiaEO/fQGIC5iTMfBKYlwJn/tHwZnSsBadYABiCNlCQCAe75swZmI8CVgNlQTzcRBmA6towMgTkJcOY/J23m4pmABGsAA5BARFKongDFv/olUAwAVwKKoR8+MQZgOENGgEBJAhT/kvSZmysBgdcABiCweIRePQGKf/VLwA0ArgS4kaJ9IBiA9qxoCQFPBCj+ntQgFq4EBFwDGICAohFy9QQo/tUvAbcAuBLgVpr1A8MABBKLUCHAJj+sgQAEMAEBRLIQMQBBhCJMCFD8WQOBCGACAoiFAQggEiFCgOLPGghIABPgXDQMgHOBCA8CFH/WQGACmADH4mEAHItDaBCg+LMGEhDABDgVEQPgVBjCggDFnzWQiAAmwKGYGACHohASBCj+rIGEBMwEfFXSdoFyu1TSvpLODBRz61AxAK1R0RACsxHgPf/ZUDPRzATuIelYTMDM1DcwHQbAhw5EAYEVAhR/1kJ2ApgAJwpjAJwIQRgQ4LI/a6AiApgAB2JjAByIQAgQoPizBiokgAkoLDoGoLAATA8Bij9roGICmICC4mMACsJnaghQ/FkDEBAmoNAiwAAUAs+0EKD4swYgcCMBTECBxYABKACdKSFA8WcNQGA9ApiAmRcFBmBm4EwHAYo/awACGySACZhxcWAAZoTNVBCg+LMGILCUACZgKaJxGmAAxuHIKBBoQ4BNftpQog0ExIOBcywCDMAclJkDAhLFn1UAgW4EuBLQjVfn1hiAzsjoAIHOBCj+nZHRAQI3EMAETLgQMAATwmVoCHDPnzUAgcEEMAGDEa49AAZgIrAMCwGKP2sAAqMRwASMhnLdQBiACaAyJAQo/qwBCIxOABMwMlIMwMhAGQ4CFH/WAAQmI4AJGBEtBmBEmAwFAUm7STpe0o6BaJwvaV9J5waKmVDrJXBPScdI2i4Qgksk7SPp+55ixgB4UoNYohPgaf/oChJ/FAIRrwScLenekn7iBTIGwIsSxBGdAMU/uoLEH41ARBPwKUmP9QIaA+BFCeKITIDiH1k9Yo9MIKIJeJGkt3iAjgHwoAIxRCZA8Y+sHrFnIGAm4ARJ2wRJ5peSbiPp6tLxYgBKK8D8kQlQ/COrR+zRCVjBP1jSn0g6UNItAiX0YklvLh0vBqC0AswflQDFP6pyxB2ZwLariv5DJP1u0GTOk7SrpOtLxo8BKEmfuaMS4FW/qMoRd0QC9rrf4yU9UdJDIyawgZgfJukLJfPBAJSkz9wRCXDmH1E1Yo5GYHtJh0h6gqT9JW0aLYEW8b5O0itatJusCQZgMrQMnJAAxT+hqKTkhoA9GLdS9G1jqoxFfzXsjzRXNYoJgAEohp6JgxGg+AcTjHBDELCif2jzIJ/tlLdJiKjHCfJUSfcaZ6h+o2AA+nGjV10EKP516U220xKwbbJXiv4DKyv6q8na64CbT4t646NjAErSZ+4IBHjgL4JKxOidwA6Snto8wf8g78HOGF/RGlx08hkhMxUE+hDgzL8PNfpAYB2Bu0myd96fUvps16Eo9m0AO8EodmAAiqFnYucEdpd0XLCv+l0oyc6u+Kqf88VVQXh2aft9i6/f/WkFufZN8fOSHt638xj9MABjUGSMbAS47J9NUfKZk4Bd7v+MpL3nnDTgXH8n6bCScWMAStJnbo8EKP4eVSGmKATsypmd2d4xSsAF43zMwiR9uuD8wgCUpM/c3ghwz9+bIsQTiYDd7/+KJNvEh2PjBC5tbi9eVxIUBqAkfeb2RIDi70kNYolGgOLfTTH7HLB9FrjogQEoip/JnRCg+DsRgjBCEqD4d5ft7pLO7N5t3B4YgHF5Mlo8AhT/eJoRsR8CFP/uWrxH0rO7dxu/BwZgfKaMGIcAxT+OVkTqjwDFv7smJ0u6v6Rfde86fg8MwPhMGTEGAZ72j6ETUfokYJewbZ8Me+WPox2BiyXde/Hqn/3p4sAAuJCBIGYmwJn/zMCZLhUBzvy7y3l6s+nPRd27TtcDAzAdW0b2SYDi71MXoopBgOLfXacvSnqcpJ917zptDwzAtHwZ3RcBir8vPYgmFgGKfze9zpP0cklHSrq+W9d5WmMA5uHMLOUJUPzLa0AEcQlQ/Ntrd6Wkv5H0vyRd277b/C0xAPMzZ8b5CfBhn/mZM2MeAntJOoYH/pYKeqKkj0k6XNLlS1s7aIABcCACIUxKgDP/SfEyeHICnPlvWGC7rP9VSR+V9BFPT/e3XZMYgLakaBeRAMU/omrE7IWAnfkfy97+N5HD9u5fKfpW+N280tdn0WAA+lCjTwQCFP8IKhGjVwJW/E9Y3Mfe1muAM8ZlRd8+crRypn/JjHNPOhUGYFK8DF6IAMW/EHimTUGA4i9Z0TcDZEXfftIU/dUrFAOQ4veVJFYRoPizHCDQn0DNxd+K/vFNwbeH+VIWfQxA/18OevomQPH3rQ/R+SZQY/H/zaqib2f6l/mWaNzouAIwLk9GK0eA4l+OPTPHJ1BT8beib98xsIJvZ/pVFX2uAMT/ZSWDmxKg+LMiINCfQA3F34q+vdFgRf+fai76GID+vyj09EeA4u9PEyKKQyBz8beibxsYrZzph9icZ86lwy2AOWkz19gEKP5jE2W8mghkLP6/XlX07Uyfor+RFY0BqOnXPVeuFP9cepLNvAQyFX8r+l9edXn/inlRxp0NAxBXu5ojp/jXrD65DyWQofhb0f9SU/Q/Lomi32NVYAB6QKNLUQIU/6L4mTw4gcjF/1eriv5RFP3hKxEDMJwhI8xHgOI/H2tmykcgYvG3ov/FVWf6V+WTpVxGGIBy7Jm5GwGKfzdetIbAagIRi//Viwf69pN0ClJOQwADMA1XRh2XAMV/XJ6MVhcBin9derfOFgPQGhUNCxGg+BcCz7QpCFD8U8g4TRIYgGm4Muo4BCj+43BklDoJUPzr1L111hiA1qhoODMBiv/MwJkuFQGKfyo5p0kGAzANV0YdRoDiP4wfvesmcK9mY5xtA2Hggb8CYmEACkBnyo0SoPizQCDQn4AVf/vS3db9h5i9J8V/duS/nRADUAg8065JgOLPwoBAfwIU//7squyJAahSdpdJU/xdykJQQQhQ/IMI5SlMDIAnNeqNheJfr/ZkPpwAxX84wypHwABUKburpCn+ruQgmGAEKP7BBPMULgbAkxr1xULxr09zMh6PAMV/PJZVjoQBqFJ2F0lT/F3IQBBBCVD8gwrnKWwMgCc16omF4l+P1mQ6PgGK//hMqxwRA1Cl7EWTpvgXxc/kwQlQ/IML6Cl8DIAnNfLHQvHPrzEZTkeA4j8d2ypHxgBUKXuRpCn+RbAzaRICFP8kQnpKAwPgSY28sVD882pLZtMToPhPz7jKGTAAVco+a9IU/1lxM1kyAhT/ZIJ6SgcD4EmNfLFQ/PNpSkbzEaD4z8e6ypkwAFXKPkvSFP9ZMDNJUgIU/6TCekoLA+BJjTyxUPzzaEkm8xOg+M/PvMoZMQBVyj5p0hT/SfEyeHICFP/kAntKDwPgSY34sVD842tIBuUI3FfSFyVtXS6EzjNfLWk/Sad07kmH4gQwAMUlSBMAxT+NlCRSgIAV/y9L2rLA3H2npPj3JeekHwbAiRDBw6D4BxeQ8IsSoPgXxV/v5BiAerUfK/PdJR0nacexBpxpnNMkfUPSuZIukHRe83P2TPMzDQSMwB9K+oKkrQLhuKa57P/tQDET6hoEMAAsiyEEIp75L8v3usYIfF/SWat+7L/Pl3T9sgH4ewi0JMCZf0tQNJuGAAZgGq41jJqx+C/Tze552lWDr0n6evNz+bJO/D0E1iBA8WdZFCeAASguQcgA7LL/8ZJuGzL6cYO2WwZmCL7a3Ao5c9zhGS0hgfs3T/vfMlBuXPYPJFbbUDEAbUnRboVAjWf+XdT/t8YIHIsh6IKtmrac+Vcjtf9EMQD+NfIU4W5NUdvJU1DOY7FbBJ+U9GFJn3MeK+FNS8DO/D/PA3/TQmb09gQwAO1Z1d6SM//hK+AySR+V9CFJJ/BA4XCggUbgzD+QWLWEigGoRelheVrxt3v+nPkP47i694WrzMBJ4w3LSA4J2Kt+tsNfpE1+rlz8zh8giVf9HC6osULCAIxFMu84nPlPr+33JB0h6QOSLp5+OmaYkQBn/jPCZqpuBDAA3XjV1priP6/itgeBbQd7uKR/kvTzeadntpEJUPxHBspw4xLAAIzLM9No9sCf3afmVb8yqv5M0gcl/UOz30CZKJi1L4EHNA/88apfX4L0m5wABmByxCEn4Mzfl2zfkvT25uHBa32FRjRrEODMn2URggAGIIRMswZJ8Z8Vd6fJLpX0XknvknRRp540nosAxX8u0swzmAAGYDDCVAPwtH8cOf9Z0v+QdGKckNNHytP+6SXOlSAGIJeeQ7LhzH8IvXJ97aHBl/GcQDkBmpntnv/RwV71s29b7CfplOL0CKAIAQxAEezuJqX4u5Okc0D2Sdm/kmTPC3DMS8CKv73nv8W80w6ajeI/CF+OzhiAHDoOyYLiP4Sev76flfRKjMBswlD8Z0PNRGMTwACMTTTWeNzzj6VXl2g/vdhq+FWSTu7SibadCDywuewf6VU/dvjrJHHuxhiA3PpuLDvO/OvQ/lONEWBL13H15sx/XJ6MVoAABqAAdAdTUvwdiDBzCPZFwlezt/so1Cn+o2BkkNIEMAClFZh/for//Mw9zYgRGKYGxX8YP3o7IoABcCTGDKGwve8MkINMYUbgrZKOCxKvhzD3abb33dxDMC1juKZ51Y9bQC2B1dQMA1CP2pz516N1l0xPb3YWtK8R/rRLx8racuZfmeA1pIsBqEFlieJfh85DsrQzRTMB9s2Bs4YMlLAvxT+hqKQkYQDyrwIu++fXeOwM7bbA+yV9hE8Sa9/mVT8u+4+9yhivOAEMQHEJJg2AM/9J8aYf3G4JHCXpSEm20+B16TO+aYKc+VcmeG3pYgDyKk7xz6tticwubj5HbGbgX0oEMPOcFP+ZgTPd/AQwAPMzn2NGdvibg3K9c1woyT5C9LnmTzMHmY5HS/qwpN8PlBQ7/AUSy0uoGAAvSowXB8V/PJaM1I7Adxevmh3T3CY4XtIV7bq5avUoSQcvNkp63OJByFu7imx5MBT/5YxosQYBDECuZcEDf7n0jJrNmc3+Al+T9BVJ5zhMZG9J9vMQSY+UFGk//9U4ec/f4eKKEhIGIIpSy+PkzH85I1qUIXCpJDMD35NkVwtWfn42Qzg7S7q9pHs0Bf/eku43w7xzTMGZ/xyUE8+BAcghLsU/h461ZXGepH+VdEnz8++SzCzYf1/ebEz0k+ZPeyPhqsXuhVtL2lbSdpJu1VyuX/lv+/92lWRF/w6SdkkMlOKfWNy5UsMAzEV6unmyF397wMw2prFCYT929mj3mH/RvKP+8+ZP+2/7R9GObZpLuluu+tPu696m+dmh+fO2knZvCsZ0CjEyBMYlQPEfl2e1o2EAYkufrfif1Hy//luSTpN0hqQ5LhNvJWmvxZPfd19sfrNn83MvSbeLvTyIPiEBin9CUUulhAEoRX74vNEf+LNLup9oHhazgn/ycCSjj2BXCuxBMbtv/AeS7tNcYh59IgaEQAsCPPDXAhJN2hPAALRn5all1E1+7B6vfYXOdpf7kqRrPUFtGYvdNnisJHtX/MBg74q3TJFmDglc3XzV7xSHsRFSUAIYgHjC2Zm/7dW+U6DQ7f78E5viHyjsVqH+sST7OUTSjq160AgC3Qhw5t+NF61bEsAAtATlpFnEM397SM/OlE90wnDKMGz72KcuHlQ8NOBmMlNyYez+BDjz78+OnksIYADiLBGKfxytfrfZXMbMwGMkRfqSXBzK+SOl+OfXuGiGGICi+FtPHvGBP7vs/7DFTmsntM4yZ0N7w8Bufzwr0QY0OZXylRWX/X3pkTIaDIB/WTnz969R2wjt1cLnLfY1eLKkLdp2ol11BDjzr07yMgljAMpwbzsrxb8tqVjtbAe7P5P0bEl2dYcDAisEKP6shdkIYABmQ915Ii77d0YWssPDF1vcvnCxV779yVE3AS77163/7NljAGZH3mpCzvxbYUrV6P6LbF6NEUilaZdkOPPvQou2oxDAAIyCcdRBKP6j4gw3mBmBV0l6RLjICbgvAYp/X3L0G0QAAzAI3+idKf6jIw07oG1B/Jpmk6GwSRD4UgIU/6WIaDAVAQzAVGS7jxtxhz/bz9/OVL/SPV16tCRg3x94maSDW7anWRwC3POPo1XKSDEAPmSNeOZv32k/QNI3fSBMH8XdGiNgrxBulj7b/Aly5p9fY/cZYgDKS0TxL69BpAjuIOkvm9cIfy9S4MR6IwGKP4vBBQEMQFkZKP5l+Uee3b5K+GJJh0m6ZeREKoud4l+Z4J7TxQCUU4fiX459ppm3kfTcZodBMwUcfglQ/P1qU2VkGIAyslP8y3DPPOstJD1D0osk7Z450aC5UfyDCpc5bAzA/OpS/OdnXtOM9jv9uOb2gH2emKM8AYp/eQ2IYA0CGIB5l0XE7X3tVb+HLnao+9q8qJhtBAK2l4B9fOjpI4zFEP0I8KpfP270moEABmAGyM0UnPnPx5qZbkpgS0mHNrcI9llsMMTv/TwrhDP/eTgzS08C/EPQE1zHbhT/jsBoPhmBXSQ9s7kqYOuSYxoCVzT7ZJwyzfCMCoHhBDAAwxkuGyHqDn8PkXTSsuT4+9AE7BmBgyQ9UZLtL8AxDoErJe0v6dRxhmMUCExDAAMwDdeVUTnzn5Yvo49HYM/m4UEzBPflNkFvsHbmb7dZzug9Ah0hMBMBDMB0oKM+8HfgYn//r0+HhZEDENihuSrw8OYy9u8HiNlDiHbm/+DFVRUu+3tQgxiWEsAALEXUqwFn/r2w0ckhAdtfYN/F7aBHNj93dxijh5A48/egAjF0IoAB6ISrVeOoZ/7c828lb/WN7CHCRzeXue8v6U7VE5E482cRhCSAARhXNs78x+XJaP4J2O2CP5JkZsB+7PkBe+2wloMz/1qUTpgnBmA8USn+47FkpLgE7N+UO0qyzxfbj21LvPK/b5/s4UKKf9x1SuTJfhlLCmrF/3hJO5UMouPcVzUPeJ3csR/NITCEgN0iMyOwa/Pqod1S+ENJ/2En1+EOAAAXgklEQVTIoAX6WvHfT9JpBeZmSgiMQoArAMMxRjzzZ4ey4bozwjgE7PfnmMYUjDPi9KNw5j89Y2aYgQAGYBhkiv8wfvSumwDFv279yb4wAQxAfwEo/v3Z0RMCFH/WAAQKE8AA9BOA4t+PG70gYAQo/qwDCDgggAHoLgLFvzszekBghQDFn7UAAScEMADdhKD4d+NFawisJkDxZz1AwBEBDEB7MSj+7VnREgI3J0DxZ01AwBkBDEA7QexTqSdK2rldcxetrmk+Scp7/i7kqDoIK/7HBvv94ZO+VS/ZOpLHACzX+VaLj6Cc1Oxotry1jxa85+9DB6LggT/WAATcEsAAbFyazZsd/mx/8ygHxT+KUvnj5LJ/fo3JMDABDMCGxdts8WGT/7e49P+wQPpS/AOJlTxUin9ygUkvPgEMwNoaGpePLvb5PiSQxBT/QGIlD5Xin1xg0stBAAOwto7vlnRYIIkp/oHESh4qxT+5wKSXhwAGYH0tXyzpTYEkpvgHEit5qBT/5AKTXi4CGICb6vmIxadJPxtIYop/ILGSh0rxTy4w6eUjgAFYp+ltJZ0pyV77i3DYJ0kPkHRKhGCJMTUBin9qeUkuKwEMwG+V3aR53e+BQYTme+RBhKogTIp/BSKTYk4CGIDf6vpaSS8PIjHFP4hQFYRJ8a9AZFLMSwADID1Y0pckRWBB8c/7uxgtM4p/NMWIFwI3IxCh6E0p2q0lnSXJ/vR+UPy9K1RPfBT/erQm08QEajcAX5T0kAD6WvHfb7Ex0WkBYiXE3AQiftiH35/ca5LsehKo2QA8XdLhPbnN2Y0z/zlpM9fGCHDmz/qAQCICtRqArST9QNL2zrWk+DsXqKLwKP4ViU2qdRCo1QC8TdLznEtM8XcuUEXhUfwrEptU6yFQowG4h6RvL17929SxzBR/x+JUFhrFvzLBSbceAjUagG9K2tuxxBR/x+JUFhrFvzLBSbcuArUZgGdKer9jiSn+jsWpLDSKf2WCk259BGoyAN4f/KP41/f75zVjir9XZYgLAiMSqMkAvE7Sy0ZkN+ZQFP8xaTLWEAIU/yH06AuBQARqMQBbSrpA0jYOtbHiv6+k0x3GRkh1EWCTn7r0JtvKCdRiAF4i6Q0Otb528R2CfSR9w2FshFQXAc7869KbbCEQ4gM4Q2W6haQLHW76c72kgyR9cmiC9IfAQAIU/4EA6Q6BiARquALwF4vi/w6H4jxX0jsdxkVIdRGg+NelN9lC4EYC2Q3AZpLOk7STM83/p6T/4iwmwqmPAMW/Ps3JGALVGACPH/w5XtL+kuwWAAcEShGg+Jciz7wQcEIg8xUAy+0sSbs5YW1hXCNpd0kXO4qJUOojQPGvT3MyhsB6BDIbgIdL+pwzzQ+WdJSzmAinLgIRX/W7srlqdmpdUpEtBKYlkNkAHCnpKdPi6zS6bUH855160BgC4xLgzH9cnowGgdAEshqAzSXZBjv2p4fjMkl3bm4BeIiHGOojQPGvT3MyhsBGCWQ1AE+V9H8caW8fITrcUTyEUhcBin9depMtBFoRyGoA7N6/PQPg4bDPD9/PQyDEUCUBin+VspM0BJYTyGgAbiPpIkmbLk9/8hb2qt+9JH1n8pmYAALrE6D4syogAIENEshoAF6w+OiPbbTj4XivpP/sIRBiqI4Axb86yUkYAt0IZDQA35L0B90wTNL615J2lnTJJKMzKAQ2TIDiz+qAAASWEshmAOxJ+3OWZj1PA3vozx7+44DAnAQo/nPSZi4IBCaQzQC8WNKbnOixR7MToZNwCKMCAhT/CkQmRQiMRSCbAfi0pEeNBWfAOEdLesSA/nSFQFcCFP+uxGgPgcoJZDIAm0i6StKWDjR9mKQvOIiDEOogQPGvQ2eyhMCoBDIZAHvd7tuj0uk3mH2AyC7/c0BgDgLs7T8HZeaAQEICmQzA8yX9rQONXi7p9Q7iIIT8BDjzz68xGUJgMgKZDMDHJT1+MlLtB95F0gXtm9MSAr0IUPx7YaMTBCCwQiCTAfixpO0KS8u2v4UFqGR6in8lQpMmBKYkkMUA7CXp9ClBtRz7v0p6a8u2NINAHwIU/z7U6AMBCKxHIIsBeNric7tHFNbX9v3fkZ3/CquQe3qKf259yQ4CsxLIYgBeK8kevit5nNp8+KdkDMydlwDFP6+2ZAaBIgSyGIAPSzq0CMF1k75T0nMLx8D0OQlQ/HPqSlYQKEogiwGw9/9tH4CSx5MX7/9/qGQAzJ2SAMU/pawkBYHyBLIYgF9I+r3COO3LfxcVjoHpcxGg+OfSk2wg4IpABgNwe0nnF6b6I0m7Fo6B6XMRoPjn0pNsIOCOQAYDcICkLxUm+wlJBxWOgenzEKD459GSTCDglkAGA3CYpHcXJvwWSS8qHAPT5yBA8c+hI1lAwD2BDAbANt55YWHSz17sAfCewjEwfXwCFP/4GpIBBMIQyGAAPijpSYWJ8/nfwgIkmJ7in0BEUoBAJAIZDMCnJD26MPQ7S/ph4RiYPi4Bin9c7YgcAmEJZDAAx0jav6ACv5G0WcH5mTo2AYp/bP2IHgJhCWQwAPYFvr0LKnCxpJ0Kzs/UcQlQ/ONqR+QQCE8ggwH4rqS7F1TiXEl3Kjg/U8ckQPGPqRtRQyANgQwG4DxJuxRU5HuS9iw4P1PHI0Dxj6cZEUMgHYEMBuBySdsWVMa+Q3CfgvMzdSwCFP9YehEtBNISyGAA7CG8TQoqdKKkBxacn6njEKD4x9GKSCGQnkAGA3B9YZW+stiKeJ/CMTC9fwJW/I+VZB+NinJc2bxhc2qUgIkTAhBoTyCDAfiZpC3apzx6y+9I+o+jj8qAmQhw5p9JTXKBQBICGQzAJZJ2KKgHXwIsCD/A1BT/ACIRIgRqJJDBAPyg8Gt4V0jarsbFQ85LCVD8lyKiAQQgUIpABgNg9yfvWQqgpOskbVpwfqb2SYDi71MXooIABBoCGQzAVyU9oLCiW0r6aeEYmN4PAYq/Hy2IBAIQ2ACBDAbgaEn2Nb6Sx90kfb9kAMzthgDF340UBAIBCGyMQAYD8DFJhxSW+SBJnygcA9OXJ0DxL68BEUAAAi0JZDAAH1h8ivcZLfOdqtlLF68ivnGqwRk3BAGKfwiZCBICEFghkMEA/HdJVoBLHodLembJAJi7KAGKf1H8TA4BCPQhkMEA/PniY0Dv65P8iH1OknT/EcdjqDgEKP5xtCJSCEBgFYEMBuBBkk4orOovJG0l6deF42D6eQlQ/OflzWwQgMCIBDIYgNtKunhEJn2H2teBEekbO/26E6D4d2dGDwhAwBGBDAbAcF4laevCXF+1+CrhXxeOgennIUDxn4czs0AAAhMSyGIA/kXSfSbk1GboYyQd0KYhbUIToPiHlo/gIQCBFQJZDMAHJT2psKw8B1BYgBmmp/jPAJkpIACBeQhkMQB26f0V8yDb6Cz7SzrOQRyEMD4Biv/4TBkRAhAoSCCLAXiapCMKclyZ+m8XzyO80EEchDAuAYr/uDwZDQIQcEAgiwHYU9IZDnheIul2i6sRv3EQCyGMQ4DiPw5HRoEABJwRyGIADOtlkm7tgO9jJH3aQRyEMJwAxX84Q0aAAAScEshkAD6yuArwBAecPyrpUAdxEMIwAhT/YfzoDQEIOCeQyQA8R9I7HfD+lSTbnOgKB7EQQj8CFP9+3OgFAQgEIpDJAHh5DsDk/0tJbwi0Dgh1HQGKP6sBAhCogkAmA2CCeXkO4FJJt5d0bRWrKE+SFP88WpIJBCCwhEA2A+DlOQDD/jxJ72AFhiFA8Q8jFYFCAAJjEMhmALw8B2DaXCTpjnwhcIxlOvkYFP/JETMBBCDgjUA2A7CXpNMdQf4zSR9wFA+hrE+A4s+qgAAEqiSQzQCYiOcsdgW8sxM1z5e02+KhwF86iYcwbkqA4s+KgAAEqiWQ0QC8UtJrHCn6OiffKXCExEUoFH8XMhAEBCBQikBGA2BP39uZt5fD9gXYQ9IPvAREHKL4swggAIHqCWQ0ACbq8ZL2caTulyQd6CiemkOh+NesPrlDAAI3EshqAP6TpL93pvPBko5yFlNt4VD8a1OcfCEAgQ0SyGoAtpRkm/Fs7kj7f5dkbyn82FFMNYVC8a9JbXKFAASWEshqACzxD0l64lIC8zY4RtJDJF0/77TVz0bxr34JAAACELg5gcwG4BGSPutQcntL4bUO48oakhX/Yxe3hHYOlODlkvZztqdFIHyECgEItCGQ2QBYbmdK2r0NiBnbXCdpX0lfnXHOWqfizL9W5ckbAhBYSiCzAbDkny7p8KUU5m9gHy36I0lnzz91NTNS/KuRmkQhAIE+BLIbgM0k/UjS7frAmbiPxbV38wXDiaeqbniKf3WSkzAEINCVQHYDYDyeK+ntXcHM1P5kSQ+S9POZ5qthGop/DSqTIwQgMJhADQZgi+YqwA6DaU0zwGckPUaSPRvAMYwAxX8YP3pDAAIVEajBAJicfyXp9Y51tS8G2pcDOfoTiPi0/5XN0/7f6Z82PSEAAQj0I1CLAdhG0gWSbIMgr8fHJR3iNTjncd1D0uecPuuxIXRW/O1tkNOcsyU8CEAgKYFaDIDJ94bFvfaXONfRXg18pKRrnMfpKbwHS/qkc3N3c15XNN+qOMMTSGKBAATqIlCTAbiVpB9Ksj89H3ZGaB8OusRzkE5ie5KkIxcbK23qJJ42YVD821CiDQQgMDmBmgyAwfT4kaC1RL5Qkn086BuTr4C4E7xm8eCk7aoY6aD4R1KLWCGQnEBtBsDktKJ63wC6/lrSSyW9JUCsc4Z46+as37Z6jnRQ/COpRawQqIBAjQbgnpJOkRQld/uewZMlXVXBelyWon1I6R8l3WZZQ2d/T/F3JgjhQAACcYrg2Fq9c3GP/TljDzrheOdJekLFtwRu0TzE+YJAxm1lOVD8J/zFYGgIQKA/gShnwf0zXLvnVovvBPxA0vZjDzzheHZLwIzLKyp7S8DO+t8r6c4Tsp1qaIr/VGQZFwIQGEygVgNg4J4p6f2DCc4/wKXNxkbvk3T9/NPPNqMV/LdJetRsM447EcV/XJ6MBgEIjEygZgNgKD+/+CzvQ0dmOtdwZ0l6Y1ATszFGt2ye7v9vc4GcYB42+ZkAKkNCAALjEqjdANgtAHvvfsdxsc462vmLTXDeLOnvg39UyL7V8HxJhy0+3mRP+kc9OPOPqhxxQ6AyArUbAJPbdpL7cgLdf9xcMn9PsE2E9pL0ouaWTHQZLm/29j89eiLEDwEI5CeAAfitxhE3ldnY6jxq8dDcEZL+2ekStm8zPFGS7eRnBizDwWX/DCqSAwQqIoABWCf2cc3HWTLJb9sJ21a5H3bwCuHWi/0XDmr2NIi2ic+yNcGZ/zJC/D0EIOCOAAZgnST2HMD3AnwroO8i+sniQ0MnLb4z8JXFg4/20aGvLS692/831bFdczn8Qc2Hb+4tabOpJis4Lvf8C8JnaghAoD8BDMBN2dmX+D7TH2e4nt+X9N3Fq3bfbB6GtO/S/6hjFjsvrjLctfmxV/d2k2T39ffsOE7E5lz2j6gaMUMAAjcQwACsvxDs9TN7va7m42pJP22uENif9nli23PALuPba3pbNj+2oVKtB8W/VuXJGwJJCGAA1hbyHZL+IonGpDE+AS77j8+UESEAgZkJYADWBm5c7ME523+fAwKrCVD8WQ8QgEAKAhiADctoD6wdLemAFEqTxBgEKP5jUGQMCEDABQEMwMZlsPvdJ0iyJ9g56iZA8a9bf7KHQDoCGIDlktq2tPb63F2WN6VFUgIU/6TCkhYEaiaAAWin/i6Svr74LO3t2jWnVSICbPKTSExSgQAE1hHAALRfDWYC7OuBe7TvQsvgBC6QtL+kc4LnQfgQgAAE1iOAAei2KG7VPBh4v27daB2QwBmLXRMPXHyd8OKAsRMyBCAAgaUEMABLEa3XYIvmIzsP696VHkEI2DbJD282QAoSMmFCAAIQ6EYAA9CN10pre0XwHyQ9o193ejkm8FlJj5f0S8cxEhoEIACBwQQwAMMQvkHSS4YNQW9HBP63pGdJus5RTIQCAQhAYBICGIDhWJ8r6W18V2E4yMIjvGYx/6sLx8D0EIAABGYjgAEYB7V9RfDIhRGwT+ByxCJgn0R+WvNcR6zIiRYCEIDAAAIYgAHwbtbVPov7kcWrgg8Yb0hGmpjAqZIOknTuxPMwPAQgAAF3BDAA40qyqaTXS7JPCsN2XLZjj/YuSS+Q9KuxB2Y8CEAAAhEIUKSmUYlbAtNwHWNULvmPQZExIACB8AQwANNJyC2B6dj2HZlL/n3J0Q8CEEhHAAMwraSbSHqOpNdKsl0EOcoQ+Kmk10l6q6Rry4TArBCAAAR8EcAAzKPHDpLe1GwcBPN5mK/M8jFJz5d00bzTMhsEIAAB3wQoRvPqY28IvFvSPeedtsrZzmquvny5yuxJGgIQgMASAhiA+ZeI3RZ4dnNJmtsC4/O3h/zslotd7v/1+MMzIgQgAIEcBDAA5XS02wJvXLyD/kxeGRxNBNuH4YVc7h+NJwNBAAKJCWAAyot7N0kvlfSnkm5RPpxwEdhZvt3n/xtJp4WLnoAhAAEIFCKAASgEfo1pd2w2pjlM0jZ+wnIbiV3qf5+kN0u6wG2UBAYBCEDAKQEMgD9htmy+SGe71N3BX3jFI/o3SW+XZDv5XVU8GgKAAAQgEJQABsC3cE+Q9FRJj/Ud5izRHd18cMk+usQBAQhAAAIDCWAABgKcqfu2kg6V9BRJD6roocFvSPq/kv5R0mUzsWYaCEAAAlUQwADEk3mX5qqAXRnYM174SyP+16boH7HYOOmHS1vTAAIQgAAEehHAAPTC5qbTnSTtJ2n/5s9d3UTWPhB7gO+45ufYxVUOMwAcEIAABCAwMQEMwMSAZx7+dpIOXGUK7jzz/G2m+9Gqgm+F/5w2nWgDAQhAAALjEsAAjMvT22j2auF9m1sFd1lcWt+t+bEvFU592NP6Zzdn9HZWbz8nc1l/auyMDwEIQKAdAQxAO07ZWm2+ygzcVZLtSmh7D9jP1pJuKWm7Vf/fVpKukXR18+rd5ZLsC3v2Gt7K/2cP6dnZvBV624f/59mgkQ8EIACBTAQwAJnUJBcIQAACEIBASwIYgJagaAYBCEAAAhDIRAADkElNcoEABCAAAQi0JIABaAmKZhCAAAQgAIFMBDAAmdQkFwhAAAIQgEBLAhiAlqBoBgEIQAACEMhEAAOQSU1ygQAEIAABCLQkgAFoCYpmEIAABCAAgUwEMACZ1CQXCEAAAhCAQEsCGICWoGgGAQhAAAIQyEQAA5BJTXKBAAQgAAEItCSAAWgJimYQgAAEIACBTAQwAJnUJBcIQAACEIBASwIYgJagaAYBCEAAAhDIRAADkElNcoEABCAAAQi0JIABaAmKZhCAAAQgAIFMBDAAmdQkFwhAAAIQgEBLAhiAlqBoBgEIQAACEMhEAAOQSU1ygQAEIAABCLQkgAFoCYpmEIAABCAAgUwEMACZ1CQXCEAAAhCAQEsCGICWoGgGAQhAAAIQyEQAA5BJTXKBAAQgAAEItCSAAWgJimYQgAAEIACBTAQwAJnUJBcIQAACEIBASwIYgJagaAYBCEAAAhDIRAADkElNcoEABCAAAQi0JIABaAmKZhCAAAQgAIFMBDAAmdQkFwhAAAIQgEBLAhiAlqBoBgEIQAACEMhEAAOQSU1ygQAEIAABCLQkgAFoCYpmEIAABCAAgUwEMACZ1CQXCEAAAhCAQEsCGICWoGgGAQhAAAIQyEQAA5BJTXKBAAQgAAEItCSAAWgJimYQgAAEIACBTAQwAJnUJBcIQAACEIBASwIYgJagaAYBCEAAAhDIRAADkElNcoEABCAAAQi0JIABaAmKZhCAAAQgAIFMBDAAmdQkFwhAAAIQgEBLAhiAlqBoBgEIQAACEMhEAAOQSU1ygQAEIAABCLQkgAFoCYpmEIAABCAAgUwEMACZ1CQXCEAAAhCAQEsCGICWoGgGAQhAAAIQyEQAA5BJTXKBAAQgAAEItCSAAWgJimYQgAAEIACBTAT+PzFZL4g6qFXLAAAAAElFTkSuQmCC",
    // #endregion
    children: [
      {
        name: "Dashboard",
        to: "/note",
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M6 1v4.48c0 .168 0 .338-.023.51q-.032.227-.103.444c-.055.165-.13.317-.204.47l-1.52 3.09h7.7l-1.5-3.06l-.018-.036c-.074-.152-.15-.304-.204-.469a2.5 2.5 0 0 1-.103-.444c-.023-.172-.023-.342-.023-.511V.994h-4zm6.35 10H3.66l-.974 1.98c-.29.59-.476.972-.588 1.26c-.09.233-.093.32-.094.332a.5.5 0 0 0 .205.329c.012.005.091.04.34.062c.311.029.736.03 1.39.03h8.12c.658 0 1.08-.001 1.39-.03c.25-.022.33-.057.34-.062a.5.5 0 0 0 .205-.33v.003v-.002l.001-.004v.004c0-.012-.005-.1-.094-.332c-.112-.292-.298-.673-.588-1.26L12.339 11zm-1.34-5.56V1h.499a.5.5 0 0 0 0-1h-7a.5.5 0 0 0 0 1h.495v4.44c0 .208 0 .312-.014.413q-.018.136-.062.266a3 3 0 0 1-.17.377l-2.97 6.04c-.563 1.15-.844 1.72-.772 2.18c.062.406.29.769.626 1c.387.269 1.03.269 2.3.269h8.12c1.28 0 1.92 0 2.3-.269c.338-.235.564-.598.626-1c.071-.465-.21-1.04-.774-2.18l-2.97-6.04c-.092-.187-.138-.28-.17-.378a1.5 1.5 0 0 1-.062-.266c-.014-.102-.014-.206-.014-.414z" clip-rule="evenodd"/></svg>`,
        layout: { topnavWidth: "180px" },
      },
      {
        name: "Profile",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "right" },
        bannerImg: { height: "80vh" },
        children: [
          {
            name: "Edit Profile",
            to: "/note",
            bannerImg: { height: "90vh" },
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Change Password",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Privacy Settings",
            to: "/note",
            bannerImg: { height: "100vh" },
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Notifications",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
        ],
      },
      {
        name: "Settings",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "right" },

        children: [
          {
            name: "Account Settings",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Security",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
        ],
      },
    ],
  },
  {
    name: "Products",
    to: "/note",
    layout: { topnavWidth: "200px", topnavDirection: "left" },
    icon: "i-uil:message",
    children: [
      {
        name: "Electronics",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "left" },

        children: [
          {
            name: "Smartphones",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Laptops",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "right" },
            children: [
              {
                name: "Gaming Laptops",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "left" },
              },
              {
                name: "Ultrabooks",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "left" },
              },
              {
                name: "Workstations",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "left" },
              },
            ],
          },
          {
            name: "Tablets",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "right" },
          },
          {
            name: "Accessories",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "right" },
            children: [
              {
                name: "Chargers",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "right" },
              },
              {
                name: "Headphones",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "right" },
              },
            ],
          },
        ],
      },
      {
        name: "Clothing",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "left" },
        children: [
          {
            name: "Men's Clothing",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
          },
          {
            name: "Women's Clothing",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
          },
          {
            name: "Kids' Clothing",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
          },
          {
            name: "Accessories",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
            children: [
              {
                name: "Belts",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "left" },
              },
              {
                name: "Hats",
                to: "/note",
                layout: { topnavWidth: "140px", topnavDirection: "left" },
              },
            ],
          },
        ],
      },
      {
        name: "Furniture",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "left" },
        children: [
          {
            name: "Living Room",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
          },
          {
            name: "Bedroom",
            to: "/note",
            layout: { topnavWidth: "160px", topnavDirection: "left" },
          },
        ],
      },
    ],
  },
  {
    name: "About",
    to: "/note",
    layout: { topnavWidth: "200px", topnavDirection: "right" },
    children: [
      {
        name: "Team",
        to: "/note",
        layout: { topnavWidth: "180px" },
      },
      {
        name: "Mission",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "left" },

        children: [
          {
            name: "History",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Values",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Goals",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
        ],
      },
      {
        name: "Careers",
        to: "/note",
        layout: { topnavWidth: "180px", topnavDirection: "left" },
        children: [
          {
            name: "Job Openings",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
          {
            name: "Internships",
            to: "/note",
            layout: { topnavWidth: "160px" },
          },
        ],
      },
    ],
  },
  {
    name: "Support",
    to: "/note",
    layout: { topnavWidth: "200px", topnavDirection: "left" },
    children: [
      {
        name: "Help Center",
        to: "/note",
        layout: { topnavWidth: "180px" },
      },
      {
        name: "Contact Us",
        to: "/note",
        layout: { topnavWidth: "180px" },
      },
      {
        name: "FAQs",
        to: "/note",
        layout: { topnavWidth: "180px" },
      },
    ],
  },
]
