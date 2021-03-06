import React, {Suspense} from "react";
import {SkeletonText, Spacer, Spinner, Stack, Text} from "@chakra-ui/react";
import {useWakandaPassDetail} from "../../../hooks/use-pass-detail.hook";
import {fmtWkdt} from "../../../util/fmt-wkdt";
import {PROCESSING} from "../../../global/constants";
import {LogoWhite} from "../../logo";

export function WakandaPassItem({address, id}){
  const pass = useWakandaPassDetail(address, id)

  return(
    <Stack p={4} borderRadius={"8"} h={48} spacing={1} color={"white"}
           bgGradient={"linear(to-r, purple.200, blue.200, teal.200)"}>
      <Stack direction={"row"} align={"center"}>
        <LogoWhite h={5} />
        <Spacer/>
        {pass.status === PROCESSING ? (
          <Spinner size={"sm"}/>
        ) : (
          <Text fontSize={"sm"} fontWeight={"bold"} onClick={pass.refresh}>{fmtWkdt(pass.pass.idleBalance, true)}</Text>
        )}
      </Stack>
      <Spacer/>
      <Text fontSize={"xs"}>{pass.pass.metadata.title} #{pass.pass.id}</Text>
      <Stack direction={"row"} align={"center"}>
        <Text fontSize={"xs"}>creator: {pass.pass.originalOwner}</Text>
        <Spacer/>
      </Stack>
    </Stack>
  )
}

export function WakandaPassItemSkeleton(){
  return(
    <Stack p={4} borderRadius={"8"} h={48} spacing={1} color={"white"}
           bgGradient={"linear(to-r, purple.200, blue.200, teal.200)"}>
      <Stack direction={"row"} align={"center"}>
        <LogoWhite h={5} />
        <Spacer/>
      </Stack>
      <Spacer/>
     <SkeletonText noOfLines={2}/>
    </Stack>
  )
}

export default function WrappedWakandaPassItem(props){
  return(
    <Suspense fallback={<WakandaPassItemSkeleton />}>
      <WakandaPassItem {...props}/>
    </Suspense>
  )
}