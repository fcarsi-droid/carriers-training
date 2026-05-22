'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const PASS_SCORE = 90

const sections = [
  { slug: 'basic', en: 'OTM Access & Daily Functions', es: 'Acceso OTM y Funciones Cotidianas', pt: 'Acesso OTM e Funções Cotidianas' },
  { slug: 'fault-codes', en: 'Fault Codes', es: 'Códigos de Falla', pt: 'Códigos de Falha' },
  { slug: 'freight-settlement', en: 'Freight Settlement', es: 'Liquidación de Flete', pt: 'Liquidação de Frete' },
]

const modules = {
  basic: [
    { id:1, video:null, en:{title:"Introduction",tag:"Module 1",desc:"Overview of the OTM training objectives and scope.",content:`<h3>Objective</h3><p>The objective of this training is to efficiently manage relationships, performance, and interactions with carriers to ensure reliable, cost-effective, and timely transportation services across the supply chain.</p><h3>Scope</h3><ul><li>Overview of OTM and its role in logistics and transportation</li><li>Understanding key functionalities that transportation providers use in OTM</li><li>Receiving and managing shipment tenders</li><li>Shipment execution and status updates</li><li>Carrier collaboration with shippers</li><li>Compliance and risk management</li></ul>`,quiz:[{q:"What is the primary objective of this OTM training?",options:["To learn how to code logistics software","To efficiently manage relationships, performance, and interactions with carriers","To replace the need for a transportation coordinator","To reduce the number of shipments processed"],correct:1},{q:"Which of the following is covered in the training scope?",options:["Financial auditing of carriers","Compliance and risk management","Warehouse construction","HR management for drivers"],correct:1}]}, es:{title:"Introducción",tag:"Módulo 1",desc:"Descripción general de los objetivos y alcance de la capacitación OTM.",content:`<h3>Objetivo</h3><p>El objetivo de esta capacitación es gestionar de manera eficiente las relaciones, el rendimiento y las interacciones con los transportistas.</p><h3>Alcance</h3><ul><li>Descripción general de OTM y su rol en logística y transporte</li><li>Comprensión de las funcionalidades clave</li><li>Recepción y gestión de licitaciones de envío</li><li>Ejecución de envíos y actualizaciones de estado</li><li>Colaboración del transportista con los cargadores</li><li>Cumplimiento y gestión de riesgos</li></ul>`,quiz:[{q:"¿Cuál es el objetivo principal de esta capacitación OTM?",options:["Aprender a programar software logístico","Gestionar eficientemente las relaciones, el rendimiento y las interacciones con los transportistas","Reemplazar la necesidad de un coordinador de transporte","Reducir el número de envíos procesados"],correct:1},{q:"¿Cuál de los siguientes temas está incluido en el alcance?",options:["Auditoría financiera de transportistas","Cumplimiento y gestión de riesgos","Construcción de almacenes","Gestión de recursos humanos"],correct:1}]}, pt:{title:"Introdução",tag:"Módulo 1",desc:"Visão geral dos objetivos e escopo do treinamento OTM.",content:`<h3>Objetivo</h3><p>O objetivo deste treinamento é gerenciar com eficiência os relacionamentos, o desempenho e as interações com transportadoras.</p><h3>Escopo</h3><ul><li>Visão geral do OTM e seu papel na logística</li><li>Funcionalidades principais usadas pelos prestadores de serviço</li><li>Recebimento e gestão de ofertas de frete</li><li>Execução de remessas e atualizações de status</li><li>Colaboração com embarcadores</li><li>Conformidade e gestão de riscos</li></ul>`,quiz:[{q:"Qual é o principal objetivo deste treinamento OTM?",options:["Aprender a programar software de logística","Gerenciar com eficiência os relacionamentos, desempenho e interações com transportadoras","Substituir a necessidade de um coordenador de transporte","Reduzir o número de remessas processadas"],correct:1},{q:"Qual dos seguintes tópicos está incluído no escopo?",options:["Auditoria financeira de transportadoras","Conformidade e gestão de riscos","Construção de armazéns","Gestão de RH para motoristas"],correct:1}]} },
    { id:2, video:"/videos/module2.mp4", en:{title:"OTM Introduction",tag:"Module 2",desc:"User login, authentication, and dashboard overview.",content:`<h3>User Login and Authentication</h3><p>Access to OTM is provided through your assigned credentials. Carriers must use only their authorized accounts and avoid sharing passwords with unauthorized team members.</p><h3>Dashboard Overview</h3><ul><li>View active and upcoming shipment tenders</li><li>Monitor shipment status and progress</li><li>Access communication tools and notifications</li><li>Manage documents such as BOL and POD</li><li>Check dock schedules and appointments</li></ul>`,quiz:[{q:"What should carriers avoid regarding their OTM login credentials?",options:["Using a strong password","Logging in daily","Sharing passwords with drivers or subcontractors","Updating their profile"],correct:2},{q:"Which of the following can be accessed from the OTM dashboard?",options:["Social media integration","Active shipment tenders and dock schedules","Weather forecasting tools","Tax filing services"],correct:1}]}, es:{title:"Introducción a OTM",tag:"Módulo 2",desc:"Inicio de sesión, autenticación y descripción general del panel de control.",content:`<h3>Inicio de sesión y autenticación</h3><p>El acceso a OTM se proporciona mediante las credenciales asignadas. Los transportistas deben usar únicamente sus cuentas autorizadas y evitar compartir contraseñas.</p><h3>Panel de control</h3><ul><li>Ver licitaciones de envío activas y próximas</li><li>Monitorear el estado y progreso de los envíos</li><li>Acceder a herramientas de comunicación y notificaciones</li><li>Gestionar documentos como BOL y POD</li><li>Verificar horarios y citas de muelles</li></ul>`,quiz:[{q:"¿Qué deben evitar los transportistas respecto a sus credenciales?",options:["Usar una contraseña segura","Iniciar sesión diariamente","Compartir contraseñas con conductores o subcontratistas","Actualizar su perfil"],correct:2},{q:"¿A qué se puede acceder desde el panel de control?",options:["Integración con redes sociales","Licitaciones activas y horarios de muelles","Herramientas de pronóstico del tiempo","Servicios de declaración de impuestos"],correct:1}]}, pt:{title:"Introdução ao OTM",tag:"Módulo 2",desc:"Login, autenticação e visão geral do painel de controle.",content:`<h3>Login e autenticação</h3><p>O acesso ao OTM é fornecido por meio de credenciais atribuídas. As transportadoras devem usar apenas suas contas autorizadas e evitar compartilhar senhas.</p><h3>Painel de controle</h3><ul><li>Ver ofertas de frete ativas e futuras</li><li>Monitorar o status das remessas</li><li>Acessar ferramentas de comunicação e notificações</li><li>Gerenciar documentos como BOL e POD</li><li>Verificar agendamentos de docas</li></ul>`,quiz:[{q:"O que as transportadoras devem evitar em relação às credenciais do OTM?",options:["Usar uma senha forte","Fazer login diariamente","Compartilhar senhas com motoristas ou subcontratados","Atualizar seu perfil"],correct:2},{q:"O que pode ser acessado pelo painel do OTM?",options:["Integração com redes sociais","Ofertas de frete ativas e agendamentos de docas","Ferramentas de previsão do tempo","Serviços de declaração de impostos"],correct:1}]} },
    { id:3, video:"/videos/module3.mp4", en:{title:"Shipment Tendering",tag:"Module 3",desc:"Understanding tenders, acceptance, rejection, spot bids, and negotiation.",content:`<h3>What is a Tender?</h3><p>A shipment tender is a formal request sent by the shipper to a carrier, offering them the opportunity to transport goods.</p><h3>Acceptance and Rejection</h3><ul><li>Capacity constraints: insufficient vehicles for the requested time windows</li><li>Rate disagreement: proposed rate does not meet expectations</li><li>Special handling: inability to manage specific requirements</li></ul><h3>Spot Bids and Negotiation</h3><p>When standard tenders are not accepted, OTM supports spot bidding and negotiation processes.</p>`,quiz:[{q:"What is a shipment tender in OTM?",options:["A delivery confirmation document","A formal request sent to a carrier to transport goods","A payment invoice for completed shipments","A dock scheduling tool"],correct:1},{q:"What does OTM support when standard tenders are not accepted?",options:["Automatic cancellation","Spot bidding and negotiation","Mandatory acceptance","Legal proceedings"],correct:1}]}, es:{title:"Licitación de Envíos",tag:"Módulo 3",desc:"Comprensión de licitaciones, aceptación, rechazo y negociación.",content:`<h3>¿Qué es una licitación?</h3><p>Una licitación de envío es una solicitud formal enviada por el cargador a un transportista.</p><h3>Aceptación y rechazo</h3><ul><li>Restricciones de capacidad</li><li>Desacuerdo en tarifas</li><li>Manejo especial requerido</li></ul><h3>Ofertas spot y negociación</h3><p>Cuando no se aceptan las licitaciones estándar, OTM admite procesos de negociación.</p>`,quiz:[{q:"¿Qué es una licitación de envío en OTM?",options:["Un documento de confirmación de entrega","Una solicitud formal enviada a un transportista para transportar mercancías","Una factura de pago","Una herramienta de programación de muelles"],correct:1},{q:"¿Qué admite OTM cuando no se aceptan las licitaciones estándar?",options:["Cancelación automática","Ofertas spot y negociación","Aceptación obligatoria","Procedimientos legales"],correct:1}]}, pt:{title:"Oferta de Frete",tag:"Módulo 3",desc:"Entendimento de ofertas, aceitação, rejeição e negociação.",content:`<h3>O que é uma oferta de frete?</h3><p>Uma oferta de frete é uma solicitação formal enviada pelo embarcador a uma transportadora.</p><h3>Aceitação e rejeição</h3><ul><li>Restrições de capacidade</li><li>Desacordo sobre tarifas</li><li>Requisitos especiais de manuseio</li></ul><h3>Licitações spot e negociação</h3><p>Quando as ofertas padrão não são aceitas, o OTM suporta processos de negociação.</p>`,quiz:[{q:"O que é uma oferta de frete no OTM?",options:["Um documento de confirmação de entrega","Uma solicitação formal enviada a uma transportadora para transportar mercadorias","Uma fatura de pagamento","Uma ferramenta de agendamento de docas"],correct:1},{q:"O que o OTM suporta quando as ofertas padrão não são aceitas?",options:["Cancelamento automático","Licitações spot e negociação","Aceitação obrigatória","Procedimentos legais"],correct:1}]} },
    { id:4, video:"/videos/module4.mp4", en:{title:"Dock & Yard Management",tag:"Module 4",desc:"Dock booking, scheduling, capacity planning, and real-time visibility.",content:`<h3>Dock Booking and Scheduling</h3><p>Plans, coordinates, and manages the arrival and departure of trucks at a warehouse to ensure efficient loading and unloading without congestion.</p><ul><li>Appointment Management: carriers reserve time slots in advance</li><li>Dock Allocation: the system assigns the most suitable dock door</li><li>Capacity Planning: ensures resources are balanced across the day</li><li>Real-Time Visibility: live updates on truck arrival status</li><li>Exception Handling: addresses late arrivals or overbooking</li></ul>`,quiz:[{q:"What is the main purpose of Dock Booking and Scheduling?",options:["To track driver salaries","To ensure loading and unloading happen efficiently and without congestion","To manage carrier invoices","To store shipment documents"],correct:1},{q:"Which process assigns the most suitable dock door?",options:["Capacity planning","Dock allocation","Exception handling","POD upload"],correct:1}]}, es:{title:"Gestión de Muelles y Patio",tag:"Módulo 4",desc:"Reserva, programación, planificación de capacidad y visibilidad en tiempo real.",content:`<h3>Reserva y programación de muelles</h3><p>Planifica, coordina y gestiona la llegada y salida de camiones para garantizar actividades eficientes sin congestión.</p><ul><li>Gestión de citas: reserva de franjas horarias con anticipación</li><li>Asignación de muelle: el sistema asigna la puerta más adecuada</li><li>Planificación de capacidad: recursos equilibrados durante el día</li><li>Visibilidad en tiempo real: actualizaciones en vivo</li><li>Gestión de excepciones: llegadas tardías o sobrecontratación</li></ul>`,quiz:[{q:"¿Cuál es el propósito principal de la Reserva y Programación de Muelles?",options:["Rastrear salarios de conductores","Garantizar que las actividades de carga y descarga ocurran eficientemente sin congestión","Gestionar facturas de transportistas","Almacenar documentos de envío"],correct:1},{q:"¿Qué proceso asigna la puerta de muelle más adecuada?",options:["Planificación de capacidad","Asignación de muelle","Gestión de excepciones","Carga de POD"],correct:1}]}, pt:{title:"Gestão de Docas e Pátio",tag:"Módulo 4",desc:"Agendamento de docas, planejamento de capacidade e visibilidade em tempo real.",content:`<h3>Agendamento de docas</h3><p>Planeja, coordena e gerencia a chegada e saída de caminhões para garantir operações eficientes sem congestionamento.</p><ul><li>Gerenciamento de agendamentos: transportadoras reservam horários com antecedência</li><li>Alocação de doca: o sistema atribui a porta mais adequada</li><li>Planejamento de capacidade: recursos equilibrados ao longo do dia</li><li>Visibilidade em tempo real: atualizações ao vivo</li><li>Gestão de exceções: chegadas atrasadas ou excesso de reservas</li></ul>`,quiz:[{q:"Qual é o principal objetivo do agendamento de docas?",options:["Rastrear salários de motoristas","Garantizar que o carregamento e descarregamento ocorram eficientemente sem congestionamento","Gerenciar faturas de transportadoras","Armazenar documentos de remessa"],correct:1},{q:"Qual processo atribui a porta de doca mais adequada?",options:["Planejamento de capacidade","Alocação de doca","Gestão de exceções","Upload de POD"],correct:1}]} },
    { id:5, video:"/videos/module5.mp4", en:{title:"Dock Changes & Rescheduling",tag:"Module 5",desc:"Managing adjustments to planned dock appointments.",content:`<h3>Dock Changes and Rescheduling</h3><p>Adjustments to planned dock appointments are required when real-world events deviate from the original plan.</p><ul><li>Delayed trucks: rescheduling ensures slots are reassigned without bottlenecks</li><li>Early arrivals: accommodated without disrupting other appointments</li><li>Shifting priorities: urgent shipments may require reordering existing slots</li><li>Communication: carriers must notify the warehouse team promptly</li><li>System updates: all changes must be reflected in OTM in real time</li></ul>`,quiz:[{q:"When is Dock Rescheduling typically required?",options:["When all shipments arrive on time","When carriers share their credentials","When real-world events deviate from the original plan, such as delayed trucks","When invoices are submitted"],correct:2},{q:"What must carriers do when a dock appointment change occurs?",options:["Wait for the warehouse to notice","Notify the warehouse team promptly and update OTM in real time","Cancel the shipment","Request a new tender"],correct:1}]}, es:{title:"Cambios y Reprogramación de Muelles",tag:"Módulo 5",desc:"Gestión de ajustes a las citas de muelle planificadas.",content:`<h3>Cambios y reprogramación</h3><p>Los ajustes son necesarios cuando los eventos del mundo real se desvían del plan original.</p><ul><li>Camiones retrasados: la reprogramación evita cuellos de botella</li><li>Llegadas anticipadas: acomodadas sin interrumpir otras citas</li><li>Cambios en prioridades: los envíos urgentes pueden reorganizar turnos</li><li>Comunicación: notificar al equipo del almacén con prontitud</li><li>Actualizaciones del sistema: todos los cambios deben reflejarse en OTM</li></ul>`,quiz:[{q:"¿Cuándo se requiere típicamente la Reprogramación de Muelles?",options:["Cuando todos los envíos llegan a tiempo","Cuando los transportistas comparten sus credenciales","Cuando los eventos del mundo real se desvían del plan original, como camiones retrasados","Cuando se envían facturas"],correct:2},{q:"¿Qué deben hacer los transportistas cuando ocurre un cambio en la cita de muelle?",options:["Esperar a que el almacén lo note","Notificar al equipo del almacén con prontitud y actualizar OTM en tiempo real","Cancelar el envío","Solicitar una nueva licitación"],correct:1}]}, pt:{title:"Alterações e Reagendamento de Docas",tag:"Módulo 5",desc:"Gerenciamento de ajustes nos agendamentos de docas planejados.",content:`<h3>Alterações e reagendamento</h3><p>Ajustes são necessários quando eventos reais desviam do plano original.</p><ul><li>Caminhões atrasados: reagendamento evita gargalos</li><li>Chegadas antecipadas: acomodadas sem prejudicar outros agendamentos</li><li>Mudança de prioridades: remessas urgentes podem reorganizar os horários</li><li>Comunicação: transportadoras devem notificar a equipe prontamente</li><li>Atualizações no sistema: todas as mudanças devem ser refletidas no OTM</li></ul>`,quiz:[{q:"Quando o reagendamento de docas é tipicamente necessário?",options:["Quando todas as remessas chegam no prazo","Quando as transportadoras compartilham suas credenciais","Quando eventos reais desviam do plano original, como caminhões atrasados","Quando faturas são enviadas"],correct:2},{q:"O que as transportadoras devem fazer quando ocorre uma mudança no agendamento?",options:["Aguardar o armazém perceber","Notificar a equipe do armazém prontamente e atualizar o OTM em tempo real","Cancelar a remessa","Solicitar uma nova oferta"],correct:1}]} },
    { id:6, video:"/videos/module6.mp4", en:{title:"Shipment Execution",tag:"Module 6",desc:"Information updates, real-time tracking, and status updates.",content:`<h3>Information Updates</h3><p>Capturing and communicating all relevant shipment events throughout the transportation lifecycle.</p><ul><li>Real-time status capture: pickup, in-transit events, customs clearance, delivery, POD</li><li>Exception reporting: delays, route changes, damage reports, or failed delivery attempts</li><li>Stakeholder communication: carriers, customers, warehouse teams, and planning units</li></ul>`,quiz:[{q:"Which of the following must a carrier report as an exception in OTM?",options:["A shipment delivered on time","A route change or failed delivery attempt","A new dock appointment confirmed in advance","A tender accepted within the deadline"],correct:1},{q:"Which statuses must be captured in real time?",options:["Only the final delivery status","Pickup, in-transit events, customs clearance, delivery, and POD","Only delays and damages","Only the departure status"],correct:1}]}, es:{title:"Ejecución de Envíos",tag:"Módulo 6",desc:"Actualizaciones de información, rastreo en tiempo real y actualizaciones de estado.",content:`<h3>Actualizaciones de información</h3><p>Captura y comunicación de todos los eventos relevantes durante el ciclo de vida del transporte.</p><ul><li>Captura de estado en tiempo real: recogida, eventos en tránsito, despacho de aduanas, entrega, POD</li><li>Reporte de excepciones: retrasos, cambios de ruta, informes de daños o intentos fallidos de entrega</li><li>Comunicación con partes interesadas: transportistas, clientes, equipos de almacén</li></ul>`,quiz:[{q:"¿Cuál debe reportar un transportista como excepción en OTM?",options:["Un envío entregado a tiempo","Un cambio de ruta o intento fallido de entrega","Una nueva cita de muelle confirmada","Una licitación aceptada dentro del plazo"],correct:1},{q:"¿Qué estados deben capturarse en tiempo real?",options:["Solo el estado de entrega final","Recogida, eventos en tránsito, despacho de aduanas, entrega y POD","Solo retrasos y daños","Solo el estado de salida"],correct:1}]}, pt:{title:"Execução de Remessas",tag:"Módulo 6",desc:"Atualizações de informações, rastreamento em tempo real e atualizações de status.",content:`<h3>Atualizações de informações</h3><p>Captura e comunicação de todos os eventos relevantes durante o ciclo de vida do transporte.</p><ul><li>Captura de status em tempo real: coleta, eventos em trânsito, despacho aduaneiro, entrega, POD</li><li>Relatório de exceções: atrasos, mudanças de rota, relatórios de danos ou tentativas de entrega fracassadas</li><li>Comunicação com partes interessadas: transportadoras, clientes, equipes de armazém</li></ul>`,quiz:[{q:"O que uma transportadora deve reportar como exceção no OTM?",options:["Uma remessa entregue no prazo","Uma mudança de rota ou tentativa de entrega fracassada","Um novo agendamento de doca confirmado","Uma oferta aceita dentro do prazo"],correct:1},{q:"Quais status devem ser capturados em tempo real?",options:["Apenas o status de entrega final","Coleta, eventos em trânsito, despacho aduaneiro, entrega e POD","Apenas atrasos e danos","Apenas o status de saída"],correct:1}]} },
    { id:7, video:"/videos/module7.mp4", en:{title:"ATA Updates & Fault Codes",tag:"Module 7",desc:"Recording actual arrival times and capturing execution-related issues.",content:`<h3>ATA Updates</h3><p>ATA (Actual Time of Arrival) updates ensure accurate arrival times are recorded promptly.</p><ul><li>ATA must be entered as soon as the truck arrives at the facility</li><li>Late or missing ATA entries affect dock planning and downstream operations</li><li>ATA data feeds into carrier performance metrics and KPI reporting</li></ul><h3>Fault Codes</h3><p>Fault codes capture issues during shipment execution, ensuring full traceability.</p><ul><li>Delays caused by traffic, weather, or mechanical failure</li><li>Equipment failures such as refrigeration or loading issues</li><li>Missing or incorrect documentation</li><li>System transmission errors</li></ul>`,quiz:[{q:"What does ATA stand for in the context of OTM?",options:["Automated Tracking Alert","Actual Time of Arrival","Advanced Transport Assignment","Authorized Tender Acceptance"],correct:1},{q:"What is the purpose of fault codes in OTM?",options:["To rate carrier performance monthly","To identify and record disruptions such as delays, equipment failures, or missing documents","To generate invoices automatically","To plan new transportation routes"],correct:1}]}, es:{title:"Actualizaciones ATA y Códigos de Falla",tag:"Módulo 7",desc:"Registro de tiempos reales de llegada y captura de problemas de ejecución.",content:`<h3>Actualizaciones ATA</h3><p>Las actualizaciones ATA garantizan que los tiempos de llegada reales se registren con prontitud.</p><ul><li>El ATA debe ingresarse en cuanto el camión llega</li><li>Las entradas tardías afectan la planificación de muelles</li><li>Los datos de ATA alimentan los reportes de KPI</li></ul><h3>Códigos de Falla</h3><ul><li>Retrasos por tráfico, clima o falla mecánica</li><li>Fallas de equipos como refrigeración</li><li>Documentación faltante o incorrecta</li><li>Errores de transmisión del sistema</li></ul>`,quiz:[{q:"¿Qué significa ATA en el contexto de OTM?",options:["Alerta de Rastreo Automatizado","Tiempo Real de Llegada","Asignación de Transporte Avanzado","Aceptación de Licitación Autorizada"],correct:1},{q:"¿Cuál es el propósito de los códigos de falla en OTM?",options:["Calificar el rendimiento mensualmente","Identificar y registrar interrupciones como retrasos, fallas de equipos o documentos faltantes","Generar facturas automáticamente","Planificar nuevas rutas"],correct:1}]}, pt:{title:"Atualizações de ATA e Códigos de Falha",tag:"Módulo 7",desc:"Registro de horários reais de chegada e captura de problemas de execução.",content:`<h3>Atualizações de ATA</h3><p>As atualizações de ATA garantem que os horários sejam registrados prontamente.</p><ul><li>O ATA deve ser inserido assim que o caminhão chegar</li><li>Entradas tardias afetam o planejamento de docas</li><li>Os dados de ATA alimentam os relatórios de KPI</li></ul><h3>Códigos de Falha</h3><ul><li>Atrasos por tráfego, clima ou falha mecânica</li><li>Falhas de equipamentos como refrigeração</li><li>Documentação faltante ou incorreta</li><li>Erros de transmissão do sistema</li></ul>`,quiz:[{q:"O que significa ATA no contexto do OTM?",options:["Alerta de Rastreamento Automático","Horário Real de Chegada","Atribuição de Transporte Avançado","Aceitação de Oferta Autorizada"],correct:1},{q:"Qual é o propósito dos códigos de falha no OTM?",options:["Avaliar o desempenho mensal","Identificar e registrar interrupções como atrasos, falhas de equipamentos ou documentos faltantes","Gerar faturas automaticamente","Planejar novas rotas"],correct:1}]} },
    { id:8, video:"/videos/module10.mp4", en:{title:"Document Management",tag:"Module 8",desc:"POD upload — ensuring proper documentation, compliance, and traceability.",content:`<h3>Document Upload</h3><p>Document Management focuses on capturing and uploading essential transportation documents.</p><ul><li>Proof of Delivery (POD): confirms that goods have been successfully delivered, including signatures, timestamps, and condition notes</li><li>Document accuracy: uploaded files must match the actual shipment</li><li>Traceability: documents stored digitally support claims, disputes, and compliance audits</li><li>Faster response: timely POD upload allows quick proof of delivery to respond to customer demands</li></ul>`,quiz:[{q:"Which document confirms that goods have been successfully delivered, including signatures and timestamps?",options:["The shipment tender","The Proof of Delivery (POD)","The dock booking confirmation","The ATA update"],correct:1},{q:"What is the main reason for uploading the POD promptly in OTM?",options:["To trigger a new shipment tender","To provide quick proof of delivery and respond to customer demands efficiently","To generate ATA fault codes","To create new shipment tenders automatically"],correct:1}]}, es:{title:"Gestión de Documentos",tag:"Módulo 8",desc:"Carga de POD — garantizando documentación adecuada, cumplimiento y trazabilidad.",content:`<h3>Carga de documentos</h3><p>La Gestión de Documentos se enfoca en capturar y cargar documentos esenciales.</p><ul><li>Prueba de entrega (POD): confirma que las mercancías fueron entregadas exitosamente</li><li>Precisión de documentos: los archivos cargados deben coincidir con el envío real</li><li>Trazabilidad: los documentos digitales apoyan reclamaciones y auditorías</li><li>Respuesta ágil: la carga oportuna del POD permite atender demandas del cliente</li></ul>`,quiz:[{q:"¿Qué documento confirma que las mercancías fueron entregadas exitosamente?",options:["La licitación de envío","La Prueba de Entrega (POD)","La confirmación de reserva de muelle","La actualización ATA"],correct:1},{q:"¿Cuál es la razón principal para cargar el POD con prontitud?",options:["Para activar una nueva licitación","Para tener el comprobante de entrega de forma ágil y atender las demandas del cliente","Para generar códigos de falla ATA","Para crear automáticamente nuevas licitaciones"],correct:1}]}, pt:{title:"Gestão de Documentos",tag:"Módulo 8",desc:"Upload de POD — garantindo documentação adequada, conformidade e rastreabilidade.",content:`<h3>Upload de documentos</h3><p>A Gestão de Documentos foca na captura e upload de documentos essenciais.</p><ul><li>Comprovante de entrega (POD): confirma que as mercadorias foram entregues, incluindo assinaturas e carimbos de tempo</li><li>Precisão dos documentos: os arquivos devem corresponder à remessa real</li><li>Rastreabilidade: documentos digitais suportam reclamações e auditorias</li><li>Resposta ágil: o upload oportuno do POD permite atender demandas do cliente</li></ul>`,quiz:[{q:"Qual documento confirma que as mercadorias foram entregues com sucesso?",options:["A oferta de frete","O Comprovante de Entrega (POD)","A confirmação de agendamento de doca","A atualização de ATA"],correct:1},{q:"Qual é o principal motivo para fazer o upload do POD prontamente?",options:["Para acionar uma nova oferta de frete","Para ter comprovante de entrega de forma ágil e atender demandas do cliente","Para gerar códigos de falha ATA","Para criar novas ofertas automaticamente"],correct:1}]} },
    { id:9, video:"/videos/module8.mp4", en:{title:"Communication Management",tag:"Module 9",desc:"OTM Chats and notifications for efficient, traceable collaboration.",content:`<h3>OTM Chats</h3><p>OTM Chats facilitates efficient and traceable communication directly within OTM.</p><ul><li>Real-time communication tied to specific shipments</li><li>Context-linked messaging: comment directly within a shipment record</li><li>Traceable communication history: valuable for audits and dispute resolution</li><li>Reduces fragmentation across emails, calls, or external messaging tools</li></ul><h3>OTM Notifications</h3><ul><li>Event-based alerts: tender sent/accepted, pickup confirmed, delivery, POD captured</li><li>Exception notifications: delays, missed appointments, route deviations</li><li>Multi-channel delivery: in-app, email, or integrated webhooks</li></ul>`,quiz:[{q:"What is a key advantage of OTM Chats over external messaging tools?",options:["It is faster to type","It centralizes shipment-linked conversations and maintains a traceable communication history","It allows anonymous messaging","It replaces the need for shipment tenders"],correct:1},{q:"Which type of notification alerts carriers about delays or missed appointments?",options:["Event-based alerts","Exception notifications","Financial alerts","Login notifications"],correct:1}]}, es:{title:"Gestión de Comunicación",tag:"Módulo 9",desc:"Chats y notificaciones de OTM para una colaboración eficiente y trazable.",content:`<h3>Chats de OTM</h3><p>Los Chats de OTM facilitan la comunicación eficiente y trazable dentro de OTM.</p><ul><li>Comunicación en tiempo real vinculada a envíos específicos</li><li>Mensajería vinculada al contexto del envío</li><li>Historial de comunicación trazable para auditorías</li><li>Reduce la fragmentación entre correos y herramientas externas</li></ul><h3>Notificaciones de OTM</h3><ul><li>Alertas basadas en eventos: licitación enviada/aceptada, recogida confirmada, entrega</li><li>Notificaciones de excepciones: retrasos, citas perdidas, desviaciones de ruta</li><li>Entrega multicanal: en la aplicación, correo electrónico o webhooks</li></ul>`,quiz:[{q:"¿Cuál es una ventaja clave de los Chats de OTM?",options:["Es más rápido escribir","Centraliza las conversaciones vinculadas a envíos y mantiene un historial trazable","Permite mensajes anónimos","Reemplaza la necesidad de licitaciones"],correct:1},{q:"¿Qué tipo de notificación alerta sobre retrasos o citas perdidas?",options:["Alertas basadas en eventos","Notificaciones de excepciones","Alertas financieras","Notificaciones de inicio de sesión"],correct:1}]}, pt:{title:"Gestão de Comunicação",tag:"Módulo 9",desc:"Chats e notificações do OTM para colaboração eficiente e rastreável.",content:`<h3>Chats do OTM</h3><p>Os Chats do OTM facilitam comunicação eficiente e rastreável diretamente no OTM.</p><ul><li>Comunicação em tempo real vinculada a remessas específicas</li><li>Mensagens vinculadas ao contexto da remessa</li><li>Histórico de comunicação rastreável para auditorias</li><li>Reduz fragmentação entre e-mails e ferramentas externas</li></ul><h3>Notificações do OTM</h3><ul><li>Alertas baseados em eventos: oferta enviada/aceita, coleta confirmada, entrega</li><li>Notificações de exceções: atrasos, agendamentos perdidos, desvios de rota</li><li>Entrega multicanal: no app, e-mail ou webhooks</li></ul>`,quiz:[{q:"Qual é a principal vantagem dos Chats do OTM?",options:["É mais rápido digitar","Centraliza conversas vinculadas a remessas e mantém histórico rastreável","Permite mensagens anônimas","Substitui a necessidade de ofertas de frete"],correct:1},{q:"Qual tipo de notificação alerta sobre atrasos ou agendamentos perdidos?",options:["Alertas baseados em eventos","Notificações de exceções","Alertas financeiros","Notificações de login"],correct:1}]} },
    { id:10, video:null, en:{title:"Compliance & Security",tag:"Module 10",desc:"Data protection best practices and secure usage of OTM.",content:`<h3>Protect Data</h3><p>Carriers must use OTM in a secure, compliant, and responsible way.</p><ul><li>Use only authorized OTM credentials — do not share passwords with unauthorized team members</li><li>Respect role-based visibility — access only shipments and data relevant to you</li><li>Handle documents (POD, invoices) accurately and completely</li><li>Use OTM Chats safely — avoid sharing personal data or financial details</li><li>Log out after completing tasks, especially on shared devices</li><li>Report any system issues or suspicious activity immediately to your transportation analyst focal point</li><li>Follow document retention practices based on contractual and compliance requirements</li></ul>`,quiz:[{q:"What should carriers do after completing their tasks in OTM on shared devices?",options:["Leave the session open","Log out to prevent unauthorized access","Delete all shipment records","Transfer credentials to a colleague"],correct:1},{q:"What should a carrier do if they notice suspicious activity in OTM?",options:["Ignore it and continue working","Try to resolve it independently","Report it immediately to your transportation analyst focal point","Share the issue on external messaging platforms"],correct:2}]}, es:{title:"Cumplimiento y Seguridad",tag:"Módulo 10",desc:"Mejores prácticas de protección de datos y uso seguro de OTM.",content:`<h3>Proteger los datos</h3><p>Los transportistas deben usar OTM de manera segura, conforme y responsable.</p><ul><li>Use solo las credenciales de OTM autorizadas — no comparta contraseñas</li><li>Respete la visibilidad basada en roles</li><li>Maneje los documentos (POD, facturas) con precisión</li><li>Use los Chats de OTM de forma segura</li><li>Cierre sesión después de completar sus tareas en dispositivos compartidos</li><li>Reporte cualquier actividad sospechosa a su analista de transporte focal point</li><li>Siga las prácticas de retención de documentos</li></ul>`,quiz:[{q:"¿Qué deben hacer los transportistas después de completar sus tareas en dispositivos compartidos?",options:["Dejar la sesión abierta","Cerrar sesión para evitar accesos no autorizados","Eliminar todos los registros de envío","Transferir credenciales a un colega"],correct:1},{q:"¿Qué debe hacer un transportista si nota actividad sospechosa en OTM?",options:["Ignorarlo y continuar trabajando","Intentar resolverlo de forma independiente","Reportarlo de inmediato a su analista de transporte focal point","Compartir el problema en plataformas externas"],correct:2}]}, pt:{title:"Conformidade e Segurança",tag:"Módulo 10",desc:"Boas práticas de proteção de dados e uso seguro do OTM.",content:`<h3>Proteger os dados</h3><p>As transportadoras devem usar o OTM de forma segura, em conformidade e responsável.</p><ul><li>Use apenas credenciais autorizadas — não compartilhe senhas</li><li>Respeite a visibilidade baseada em função</li><li>Gerencie documentos (POD, faturas) com precisão</li><li>Use os Chats do OTM com segurança</li><li>Faça logout após concluir tarefas em dispositivos compartilhados</li><li>Reporte qualquer atividade suspeita ao seu analista de transporte focal point</li><li>Siga as práticas de retenção de documentos</li></ul>`,quiz:[{q:"O que as transportadoras devem fazer após concluir tarefas em dispositivos compartilhados?",options:["Deixar a sessão aberta","Fazer logout para evitar acesso não autorizado","Excluir todos os registros de remessa","Transferir credenciais para um colega"],correct:1},{q:"O que uma transportadora deve fazer se notar atividade suspeita?",options:["Ignorar e continuar trabalhando","Tentar resolver de forma independente","Reportar imediatamente ao seu analista de transporte focal point","Compartilhar o problema em plataformas externas"],correct:2}]} },
  ],
  'fault-codes': [
    { id:1, video:null,
      en:{title:"Fault Codes Overview",tag:"Module 1",desc:"Coming soon — content will be added shortly.",content:`<h3>Coming Soon</h3><p>This module is under development. Content will be added shortly.</p>`,quiz:[{q:"Placeholder question 1",options:["Option A","Option B","Option C","Option D"],correct:0},{q:"Placeholder question 2",options:["Option A","Option B","Option C","Option D"],correct:0}]},
      es:{title:"Resumen de Códigos de Falla",tag:"Módulo 1",desc:"Próximamente — el contenido se añadirá en breve.",content:`<h3>Próximamente</h3><p>Este módulo está en desarrollo.</p>`,quiz:[{q:"Pregunta de marcador 1",options:["Opción A","Opción B","Opción C","Opción D"],correct:0},{q:"Pregunta de marcador 2",options:["Opción A","Opción B","Opción C","Opción D"],correct:0}]},
      pt:{title:"Visão Geral dos Códigos de Falha",tag:"Módulo 1",desc:"Em breve — o conteúdo será adicionado em breve.",content:`<h3>Em breve</h3><p>Este módulo está em desenvolvimento.</p>`,quiz:[{q:"Pergunta de espaço reservado 1",options:["Opção A","Opção B","Opção C","Opção D"],correct:0},{q:"Pergunta de espaço reservado 2",options:["Opção A","Opção B","Opção C","Opção D"],correct:0}]}
    }
  ],
  'freight-settlement': [
    { id:1, video:null,
      en:{title:"Freight Settlement Overview",tag:"Module 1",desc:"Coming soon — content will be added shortly.",content:`<h3>Coming Soon</h3><p>This module is under development. Content will be added shortly.</p>`,quiz:[{q:"Placeholder question 1",options:["Option A","Option B","Option C","Option D"],correct:0},{q:"Placeholder question 2",options:["Option A","Option B","Option C","Option D"],correct:0}]},
      es:{title:"Resumen de Liquidación de Flete",tag:"Módulo 1",desc:"Próximamente — el contenido se añadirá en breve.",content:`<h3>Próximamente</h3><p>Este módulo está en desarrollo.</p>`,quiz:[{q:"Pregunta de marcador 1",options:["Opción A","Opción B","Opción C","Opción D"],correct:0},{q:"Pregunta de marcador 2",options:["Opción A","Opción B","Opción C","Opción D"],correct:0}]},
      pt:{title:"Visão Geral da Liquidação de Frete",tag:"Módulo 1",desc:"Em breve — o conteúdo será adicionado em breve.",content:`<h3>Em breve</h3><p>Este módulo está em desenvolvimento.</p>`,quiz:[{q:"Pergunta de espaço reservado 1",options:["Opção A","Opção B","Opção C","Opção D"],correct:0},{q:"Pergunta de espaço reservado 2",options:["Opção A","Opção B","Opção C","Opção D"],correct:0}]}
    }
  ]
}

const labels = {
  en:{modules:'Modules',finalQuiz:'Final Quiz',prev:'← Previous',next:'Next →',goQuiz:'Go to Final Quiz →',quizTitle:'Final Knowledge Check',quizDesc:'Answer all questions. You need 90% or more to pass.',submit:'Submit Quiz',restart:'Restart',pass:'Congratulations! You passed.',fail:'You did not reach the minimum score of 90%.',review:'Modules to review:',logout:'Logout',selectSection:'Select a training section to begin'},
  es:{modules:'Módulos',finalQuiz:'Quiz Final',prev:'← Anterior',next:'Siguiente →',goQuiz:'Ir al Quiz Final →',quizTitle:'Verificación Final',quizDesc:'Responde todas las preguntas. Necesitas 90% o más para aprobar.',submit:'Enviar Quiz',restart:'Reiniciar',pass:'¡Felicitaciones! Aprobaste.',fail:'No alcanzaste la puntuación mínima del 90%.',review:'Módulos para revisar:',logout:'Cerrar sesión',selectSection:'Selecciona una sección de capacitación para comenzar'},
  pt:{modules:'Módulos',finalQuiz:'Quiz Final',prev:'← Anterior',next:'Próximo →',goQuiz:'Ir para o Quiz Final →',quizTitle:'Verificação Final',quizDesc:'Responda todas as perguntas. Você precisa de 90% ou mais para passar.',submit:'Enviar Quiz',restart:'Reiniciar',pass:'Parabéns! Você passou.',fail:'Você não atingiu a pontuação mínima de 90%.',review:'Módulos para revisar:',logout:'Sair',selectSection:'Selecione uma seção de treinamento para começar'}
}

export default function TrainingPage() {
  const [lang, setLang] = useState(null)
  const [activeSection, setActiveSection] = useState(null)
  const [currentModule, setCurrentModule] = useState(0)
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [userName, setUserName] = useState('')
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    if (localStorage.getItem('role') === 'admin') { router.push('/admin'); return }
    setUserName(localStorage.getItem('name') || '')
  }, [])

  function logout() { localStorage.clear(); router.push('/login') }

  const tx = labels[lang] || labels.en
  const sectionModules = activeSection ? modules[activeSection] : []
  const progress = sectionModules.length ? Math.round(((currentModule + 1) / sectionModules.length) * 100) : 0

  async function submitQuiz() {
    let correct = 0; let total = 0; const failedMods = []
    sectionModules.forEach((m, mi) => {
      const d = m[lang]
      let modCorrect = 0
      d.quiz.forEach((q, qi) => {
        total++
        const ans = quizAnswers[`${mi}-${qi}`]
        if (ans === q.correct) { correct++; modCorrect++ }
      })
      if (modCorrect < d.quiz.length) failedMods.push(m[lang].tag + ': ' + m[lang].title)
    })
    const score = Math.round((correct / total) * 100)
    const passed = score >= PASS_SCORE
    setQuizSubmitted(true)
    setQuizResult({ score, passed, failedMods })
    const token = localStorage.getItem('token')
    await fetch('/api/quiz/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ score, passed, answers: quizAnswers, language: lang, section: activeSection })
    })
  }

  function selectSection(slug) {
    setActiveSection(slug)
    setCurrentModule(0)
    setShowQuiz(false)
    setQuizAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)
  }

  if (!lang) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#003865] via-[#005B9A] to-[#0078C8]">
      <div className="bg-white rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <div className="inline-block bg-[#003865] text-white text-xs font-bold tracking-widest px-4 py-2 rounded mb-6">OTM CARRIERS TRAINING</div>
        <h1 className="text-2xl font-bold text-[#003865] mb-2">Welcome{userName ? `, ${userName}` : ''}</h1>
        <p className="text-gray-400 text-sm mb-8">Choose your language / Elija su idioma / Escolha seu idioma</p>
        <div className="flex gap-4 justify-center">
          {[['en','🇺🇸','English'],['es','🇪🇸','Español'],['pt','🇧🇷','Português']].map(([code,flag,label]) => (
            <button key={code} onClick={() => setLang(code)}
              className="flex-1 flex flex-col items-center gap-2 border-2 border-gray-200 rounded-xl py-4 hover:border-[#003865] hover:bg-[#E8F3FB] transition font-semibold text-[#003865]">
              <span className="text-3xl">{flag}</span>
              <span className="text-sm">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#003865] text-white px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-lg">
        <div>
          <div className="font-bold">OTM Carriers Training</div>
          <div className="text-xs opacity-60">{userName}</div>
        </div>
        <div className="flex items-center gap-3">
          <select value={lang} onChange={e => setLang(e.target.value)}
            className="bg-white/10 border border-white/20 text-white text-xs rounded-full px-3 py-1 focus:outline-none">
            <option value="en">🇺🇸 EN</option>
            <option value="es">🇪🇸 ES</option>
            <option value="pt">🇧🇷 PT</option>
          </select>
          <button onClick={logout} className="text-xs bg-white/10 hover:bg-white/20 px-4 py-1.5 rounded-full transition">{tx.logout}</button>
        </div>
      </header>

      {activeSection && <div className="bg-[#005B9A] h-1"><div className="h-full bg-[#5BC8F5] transition-all duration-500" style={{width: showQuiz ? '100%' : progress+'%'}}></div></div>}

      {!activeSection ? (
        // Section selection screen
        <div className="max-w-3xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>Training Sections</h2>
          <p className="text-gray-400 mb-10">{tx.selectSection}</p>
          <div className="grid gap-4">
            {sections.map(s => (
              <button key={s.slug} onClick={() => selectSection(s.slug)}
                className="bg-white rounded-2xl shadow-sm p-6 text-left hover:shadow-md hover:border-[#0078C8] border-2 border-transparent transition group">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest text-[#0078C8] mb-1">{s.slug.replace('-',' ').toUpperCase()}</div>
                    <div className="text-lg font-bold text-[#003865]">{s[lang]}</div>
                    <div className="text-sm text-gray-400 mt-1">{modules[s.slug]?.length || 0} modules</div>
                  </div>
                  <div className="text-2xl text-gray-200 group-hover:text-[#0078C8] transition">→</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex" style={{minHeight:'calc(100vh - 68px)'}}>
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-100 py-4 sticky top-16 h-[calc(100vh-68px)] overflow-y-auto hidden md:block flex-shrink-0">
            <button onClick={() => setActiveSection(null)} className="flex items-center gap-2 px-5 py-2 text-xs text-gray-400 hover:text-[#003865] transition mb-2">
              ← Back to sections
            </button>
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 px-5 mb-2">{tx.modules}</div>
            {sectionModules.map((m,i) => (
              <div key={m.id} onClick={() => { setShowQuiz(false); setCurrentModule(i) }}
                className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition ${!showQuiz && i===currentModule ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
                <span className="text-xs text-gray-400 w-4">{m.id}</span>
                <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
                <span className="truncate">{m[lang].title}</span>
              </div>
            ))}
            <div onClick={() => setShowQuiz(true)}
              className={`flex items-center gap-3 px-5 py-2.5 cursor-pointer border-l-[3px] text-sm font-medium transition mt-2 border-t border-gray-100 ${showQuiz ? 'bg-[#E8F3FB] border-[#0078C8] text-[#003865] font-semibold' : 'border-transparent text-gray-500 hover:bg-gray-50'}`}>
              <span className="text-xs text-gray-400 w-4">★</span>
              <div className="w-2 h-2 rounded-full bg-gray-200 flex-shrink-0"></div>
              <span>{tx.finalQuiz}</span>
            </div>
          </aside>

          <main className="flex-1 p-8 max-w-3xl">
            {!showQuiz ? (
              <ModuleView m={sectionModules[currentModule]} lang={lang} tx={tx}
                isLast={currentModule===sectionModules.length-1}
                onPrev={() => setCurrentModule(i => i-1)}
                onNext={() => setCurrentModule(i => i+1)}
                onQuiz={() => setShowQuiz(true)}
                showPrev={currentModule > 0} />
            ) : (
              <QuizView modules={sectionModules} lang={lang} tx={tx}
                answers={quizAnswers} setAnswers={setQuizAnswers}
                submitted={quizSubmitted} result={quizResult}
                onSubmit={submitQuiz}
                onRestart={() => { setShowQuiz(false); setCurrentModule(0); setQuizAnswers({}); setQuizSubmitted(false); setQuizResult(null) }} />
            )}
          </main>
        </div>
      )}
    </div>
  )
}

function ModuleView({ m, lang, tx, isLast, onPrev, onNext, onQuiz, showPrev }) {
  const d = m[lang]
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">{d.tag}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{d.title}</h2>
        <p className="text-gray-500 text-sm">{d.desc}</p>
      </div>
      {m.video && (
        <div className="bg-[#003865] rounded-xl overflow-hidden mb-5 shadow-lg">
          <video controls className="w-full" style={{aspectRatio:'16/9'}} src={m.video}
            onError={e => { e.target.style.display='none'; e.target.parentElement.innerHTML+='<div style="aspect-ratio:16/9;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#002244,#003865);color:rgba(255,255,255,0.3);font-size:0.85rem">Video not found</div>' }} />
          <div className="px-4 py-2 text-xs text-white/40 border-t border-white/10">{d.tag} — {d.title}</div>
        </div>
      )}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-5"
        dangerouslySetInnerHTML={{__html: d.content
          .replace(/<h3>/g,'<h3 style="color:#003865;font-weight:700;font-size:1rem;margin-top:16px;margin-bottom:8px">')
          .replace(/<ul>/g,'<ul style="list-style:disc;padding-left:20px;margin:8px 0">')
          .replace(/<li>/g,'<li style="color:#4A5568;font-size:0.9rem;margin-bottom:4px;line-height:1.6">')
          .replace(/<p>/g,'<p style="color:#4A5568;font-size:0.92rem;line-height:1.7;margin-bottom:12px">')}} />
      <div className="flex gap-3 mt-6 pt-5 border-t border-gray-100">
        {showPrev && <button onClick={onPrev} className="border border-gray-200 text-gray-600 hover:border-[#0078C8] hover:text-[#0078C8] font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.prev}</button>}
        {isLast
          ? <button onClick={onQuiz} className="ml-auto bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.goQuiz}</button>
          : <button onClick={onNext} className="ml-auto bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition">{tx.next}</button>}
      </div>
    </div>
  )
}

function QuizView({ modules, lang, tx, answers, setAnswers, submitted, result, onSubmit, onRestart }) {
  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-bold uppercase tracking-widest text-[#0078C8] bg-[#E8F3FB] px-3 py-1 rounded mb-3">★ {tx.finalQuiz}</span>
        <h2 className="text-3xl font-bold text-[#003865] mb-2" style={{fontFamily:'Georgia,serif'}}>{tx.quizTitle}</h2>
        <p className="text-gray-500 text-sm">{tx.quizDesc}</p>
      </div>
      {modules.map((m, mi) => {
        const d = m[lang]
        return (
          <div key={m.id} className="bg-white rounded-xl shadow-sm p-6 mb-4">
            <div className="text-xs font-bold uppercase tracking-widest text-[#0078C8] mb-4">{d.tag} — {d.title}</div>
            {d.quiz.map((q, qi) => {
              const key = `${mi}-${qi}`
              const userAns = answers[key]
              return (
                <div key={qi} className="mb-5 last:mb-0">
                  <div className="font-semibold text-sm text-[#003865] mb-3"><span className="text-[#0078C8]">Q{mi*2+qi+1}.</span> {q.q}</div>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => {
                      let cls = 'border-gray-200 text-gray-600 hover:border-[#0078C8] hover:bg-[#E8F3FB]'
                      if (submitted) {
                        if (oi === q.correct) cls = 'border-green-400 bg-green-50 text-green-700 font-semibold'
                        else if (oi === userAns) cls = 'border-red-400 bg-red-50 text-red-600'
                        else cls = 'border-gray-100 text-gray-400'
                      } else if (userAns === oi) cls = 'border-[#0078C8] bg-[#E8F3FB] text-[#003865] font-medium'
                      return (
                        <label key={oi} className={`flex items-start gap-3 border-2 rounded-lg px-4 py-3 text-sm cursor-pointer transition ${cls}`}>
                          <input type="radio" name={key} value={oi} disabled={submitted}
                            checked={userAns === oi} onChange={() => setAnswers(a => ({...a, [key]: oi}))}
                            className="mt-0.5 flex-shrink-0 accent-[#0078C8]" />
                          {opt}
                        </label>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
      {!submitted && <button onClick={onSubmit} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-8 py-3 rounded-lg transition mb-8">{tx.submit}</button>}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mt-4 mb-8">
          <div className="text-4xl mb-3">{result.passed ? '🎉' : '📋'}</div>
          <div className={`text-5xl font-bold mb-3 ${result.passed ? 'text-green-600' : 'text-red-500'}`}>{result.score}%</div>
          <p className="text-gray-600 mb-4">{result.passed ? tx.pass : tx.fail}</p>
          {!result.passed && result.failedMods.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-left">
              <div className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-2">{tx.review}</div>
              <ul className="space-y-1">{result.failedMods.map((m,i) => <li key={i} className="text-sm text-amber-700">→ {m}</li>)}</ul>
            </div>
          )}
          <button onClick={onRestart} className="bg-[#003865] hover:bg-[#0078C8] text-white font-semibold px-6 py-2.5 rounded-lg transition">{tx.restart}</button>
        </div>
      )}
    </div>
  )
}
